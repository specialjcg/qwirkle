//! Evaluate the neural bot (Graph Transformer) against the greedy bot.
//!
//! Plays N games with alternating first player, reports win rate and score stats.
//!
//! Usage: cargo run --features neural --bin evaluate -- \
//!          --model models/qwirkle_v1.pt --games 200

use std::collections::HashSet;

use rand::seq::SliceRandom;
use rand::thread_rng;
use tch::{nn, no_grad_guard, Device, Kind, Tensor};

use qwirkle_backend::domain::ai::{best_moves, ScoredMove};
use qwirkle_backend::domain::rules::validate_and_score;
use qwirkle_backend::domain::tile::{BoardTile, Coordinate, RackTile, TileFace};
use qwirkle_backend::neural::graph_transformer::{QwirkleNet, MAX_NODES, NUM_TILE_FACES};
use qwirkle_backend::neural::mcts::{MCTSNode, MCTS};
use qwirkle_backend::neural::model_io::load_model;
use qwirkle_backend::neural::tensor_conversion::{
    build_action_mask, compute_bag_distribution, compute_rack_distribution,
    extract_nodes, nodes_to_tensor, tile_face_from_index, GameContext,
};

/// Which strategy a player uses.
#[derive(Clone, Copy, PartialEq)]
enum Strategy {
    Greedy,
    Neural,
}

struct SimPlayer {
    rack: Vec<TileFace>,
    score: i32,
    strategy: Strategy,
}

struct GameResult {
    scores: [i32; 2],
    strategies: [Strategy; 2],
}

fn main() {
    let args: Vec<String> = std::env::args().collect();
    let model_path = parse_arg_str(&args, "--model")
        .unwrap_or_else(|| "models/qwirkle_v1.pt".to_string());
    let num_games = parse_arg(&args, "--games").unwrap_or(200);
    let max_turns = parse_arg(&args, "--max-turns").unwrap_or(200);
    let mcts_sims: u32 = parse_arg(&args, "--mcts").map(|n| n as u32).unwrap_or(0);

    println!("Evaluation: Neural{} vs Greedy bot",
        if mcts_sims > 0 { format!(" (MCTS {} sims)", mcts_sims) } else { String::new() });
    println!("  model:     {model_path}");
    println!("  games:     {num_games}");
    if mcts_sims > 0 {
        println!("  mcts sims: {mcts_sims}");
    }

    // Load model
    let device = Device::cuda_if_available();
    println!("  device:    {:?}", device);

    let mut vs = nn::VarStore::new(device);
    let model = QwirkleNet::new(&vs);
    load_model(&mut vs, &model_path).expect("Failed to load model");
    println!("Model loaded.\n");

    let mut rng = thread_rng();
    let mut results: Vec<GameResult> = Vec::new();

    for game_idx in 0..num_games {
        // Alternate who goes first
        let strategies = if game_idx % 2 == 0 {
            [Strategy::Neural, Strategy::Greedy]
        } else {
            [Strategy::Greedy, Strategy::Neural]
        };

        let result = play_one_game(&model, &strategies, &mut rng, max_turns, device, mcts_sims);
        results.push(result);

        if (game_idx + 1) % 50 == 0 {
            print_stats(&results, game_idx + 1);
        }
    }

    println!("\n=== Final Results ({num_games} games) ===");
    print_stats(&results, num_games);
}

fn play_one_game(
    model: &QwirkleNet,
    strategies: &[Strategy; 2],
    rng: &mut impl rand::Rng,
    max_turns: usize,
    device: Device,
    mcts_sims: u32,
) -> GameResult {
    let mut bag = TileFace::full_bag();
    bag.shuffle(rng);

    let mut players = [
        SimPlayer { rack: Vec::new(), score: 0, strategy: strategies[0] },
        SimPlayer { rack: Vec::new(), score: 0, strategy: strategies[1] },
    ];

    for player in &mut players {
        for _ in 0..6 {
            if let Some(tile) = bag.pop() {
                player.rack.push(tile);
            }
        }
    }

    let mut board: Vec<BoardTile> = Vec::new();
    let mut current = 0usize;
    let mut consecutive_passes = 0;

    let _guard = no_grad_guard();

    for _turn in 0..max_turns {
        let rack_tiles: Vec<RackTile> = players[current]
            .rack
            .iter()
            .enumerate()
            .map(|(i, &face)| RackTile { face, rack_position: i as u8 })
            .collect();

        let chosen = match players[current].strategy {
            Strategy::Greedy => {
                let moves = best_moves(&board, &rack_tiles);
                if moves.is_empty() {
                    None
                } else {
                    Some(moves[0].clone())
                }
            }
            Strategy::Neural => {
                if mcts_sims > 0 {
                    mcts_choose_move(model, &board, &players[current].rack, &players, current, bag.len(), device, mcts_sims)
                } else {
                    neural_choose_move(model, &board, &players[current].rack, &players, current, bag.len(), device)
                }
            }
        };

        match chosen {
            None => {
                consecutive_passes += 1;
                if consecutive_passes >= 4 {
                    break;
                }
                // Swap tiles
                let hand = players[current].rack.clone();
                for tile in &hand {
                    bag.push(*tile);
                }
                players[current].rack.clear();
                bag.shuffle(rng);
                let draw_count = hand.len().min(bag.len());
                for _ in 0..draw_count {
                    if let Some(t) = bag.pop() {
                        players[current].rack.push(t);
                    }
                }
            }
            Some(chosen_move) => {
                consecutive_passes = 0;
                players[current].score += chosen_move.score;

                for placed in &chosen_move.tiles {
                    board.push(*placed);
                    if let Some(pos) = players[current].rack.iter().position(|&f| f == placed.face) {
                        players[current].rack.remove(pos);
                    }
                }

                let tiles_used = chosen_move.tiles.len();
                for _ in 0..tiles_used {
                    if let Some(t) = bag.pop() {
                        players[current].rack.push(t);
                    }
                }

                if players[current].rack.is_empty() && bag.is_empty() {
                    players[current].score += 6;
                    break;
                }
            }
        }

        current = 1 - current;
    }

    GameResult {
        scores: [players[0].score, players[1].score],
        strategies: *strategies,
    }
}

/// MCTS-based move selection using current model as guide.
fn mcts_choose_move(
    model: &QwirkleNet,
    board: &[BoardTile],
    rack: &[TileFace],
    players: &[SimPlayer; 2],
    current: usize,
    bag_remaining: usize,
    device: Device,
    n_sims: u32,
) -> Option<ScoredMove> {
    let opponent = 1 - current;
    let root = MCTSNode::new_root(
        board.to_vec(),
        rack.to_vec(),
        bag_remaining,
        players[current].score,
        players[opponent].score,
    );
    let mut mcts = MCTS::new(root, device);
    mcts.search(model, n_sims);
    mcts.best_move()
}

/// Neural bot: use policy head to pick the best single-tile move,
/// then try extending with value head for multi-tile.
fn neural_choose_move(
    model: &QwirkleNet,
    board: &[BoardTile],
    rack: &[TileFace],
    players: &[SimPlayer; 2],
    current: usize,
    bag_remaining: usize,
    device: Device,
) -> Option<ScoredMove> {
    let opponent = 1 - current;

    // First, get all legal moves from the greedy engine (for multi-tile)
    let rack_tiles: Vec<RackTile> = rack
        .iter()
        .enumerate()
        .map(|(i, &face)| RackTile { face, rack_position: i as u8 })
        .collect();
    let legal_moves = best_moves(board, &rack_tiles);

    if legal_moves.is_empty() {
        return None;
    }

    // If only one legal move, take it
    if legal_moves.len() == 1 {
        return Some(legal_moves[0].clone());
    }

    // Evaluate each candidate move with value network:
    // for each move, compute the resulting board state and get V(s')
    let mut best_value = f64::NEG_INFINITY;
    let mut best_move_idx = 0;

    for (i, m) in legal_moves.iter().enumerate() {
        // Build hypothetical board after this move
        let mut new_board = board.to_vec();
        new_board.extend_from_slice(&m.tiles);

        let nodes = extract_nodes(&new_board, &[]);
        let (feat, mask) = nodes_to_tensor(&nodes, &new_board);

        let mut new_rack = rack.to_vec();
        for tile in &m.tiles {
            if let Some(pos) = new_rack.iter().position(|&f| f == tile.face) {
                new_rack.remove(pos);
            }
        }
        let ctx = GameContext {
            bag_remaining: bag_remaining as f32,
            player_score: (players[current].score + m.score) as f32,
            opponent_score: players[opponent].score as f32,
            rack_size: new_rack.len() as f32,
            bag_distribution: compute_bag_distribution(&new_board, &new_rack),
            rack_distribution: compute_rack_distribution(&new_rack),
        };

        let feat_batch = feat.unsqueeze(0).to(device);
        let mask_batch = mask.unsqueeze(0).to(device);
        let ctx_tensor = ctx.to_tensor().unsqueeze(0).to(device);

        let value = model.forward_value(&feat_batch, &mask_batch, &ctx_tensor, false);
        let v = f64::try_from(&value.squeeze_dim(0).squeeze_dim(0)).unwrap_or(0.0);

        // Combine: immediate score + discounted future value
        let combined = m.score as f64 * 0.1 + v;

        if combined > best_value {
            best_value = combined;
            best_move_idx = i;
        }
    }

    Some(legal_moves[best_move_idx].clone())
}

fn print_stats(results: &[GameResult], total_games: usize) {
    let mut neural_wins = 0;
    let mut greedy_wins = 0;
    let mut draws = 0;
    let mut neural_total_score = 0i64;
    let mut greedy_total_score = 0i64;
    let mut neural_games = 0;

    for r in results {
        for p in 0..2 {
            if r.strategies[p] == Strategy::Neural {
                neural_total_score += r.scores[p] as i64;
                neural_games += 1;
            } else {
                greedy_total_score += r.scores[p] as i64;
            }
        }

        let neural_idx = if r.strategies[0] == Strategy::Neural { 0 } else { 1 };
        let greedy_idx = 1 - neural_idx;

        if r.scores[neural_idx] > r.scores[greedy_idx] {
            neural_wins += 1;
        } else if r.scores[neural_idx] < r.scores[greedy_idx] {
            greedy_wins += 1;
        } else {
            draws += 1;
        }
    }

    let n = results.len() as f64;
    println!(
        "  [{total_games}] Neural {neural_wins}W / {greedy_wins}L / {draws}D \
         ({:.1}%) | avg score: Neural {:.1} vs Greedy {:.1}",
        neural_wins as f64 / n * 100.0,
        neural_total_score as f64 / neural_games as f64,
        greedy_total_score as f64 / neural_games as f64,
    );
}

fn parse_arg(args: &[String], name: &str) -> Option<usize> {
    args.iter()
        .position(|a| a == name)
        .and_then(|i| args.get(i + 1))
        .and_then(|v| v.parse().ok())
}

fn parse_arg_str(args: &[String], name: &str) -> Option<String> {
    args.iter()
        .position(|a| a == name)
        .and_then(|i| args.get(i + 1))
        .cloned()
}
