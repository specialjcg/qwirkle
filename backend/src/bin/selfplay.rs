//! Self-play data generation for Qwirkle neural bot training.
//!
//! Modes:
//! - greedy vs greedy (default): bootstrap initial training data
//! - neural vs greedy (--model): improve from current model
//!
//! Records (board_state, context, action_index, value) tuples.
//!
//! Usage:
//!   cargo run --features neural --bin selfplay -- --games 1000 --out data/selfplay.bin
//!   cargo run --features neural --bin selfplay -- --games 500 --model models/v1.pt --out data/improve.bin

use std::fs;
use std::io::Write;
use std::path::Path;

use rand::seq::SliceRandom;
use rand::Rng;
use tch::{nn, no_grad_guard, Kind, Tensor, Device};

use qwirkle_backend::domain::ai::{best_moves, ScoredMove};
use qwirkle_backend::domain::tile::{BoardTile, RackTile, TileFace};
use qwirkle_backend::neural::graph_transformer::{QwirkleNet, MAX_NODES, NUM_TILE_FACES, INPUT_DIM};
use qwirkle_backend::neural::model_io::load_model;
use qwirkle_backend::neural::tensor_conversion::{
    build_action_mask, extract_nodes, nodes_to_tensor, tile_face_index, GameContext,
};

/// Compact sample: ~11.3 KB per sample instead of ~67 KB.
#[derive(Debug, Clone)]
struct Sample {
    features: Vec<f32>,     // [MAX_NODES * INPUT_DIM] = 2816 floats
    mask: Vec<u8>,          // [MAX_NODES] = 128 bytes (bool as u8)
    context: [f32; 4],      // 4 floats
    action_mask_bits: Vec<u8>, // bitpacked [MAX_NODES * 36] = 576 bytes
    action_index: u32,      // flat index into [MAX_NODES * 36], u32::MAX = pass
    value: f32,             // +1 / -1 / 0
}

struct SimPlayer {
    rack: Vec<TileFace>,
    score: i32,
    use_neural: bool,
    samples: Vec<PendingSample>,
}

struct PendingSample {
    features: Vec<f32>,
    mask: Vec<u8>,
    context: [f32; 4],
    action_mask_bits: Vec<u8>,
    action_index: u32,
}

fn main() {
    let args: Vec<String> = std::env::args().collect();
    let num_games = parse_arg(&args, "--games").unwrap_or(1000);
    let out_path = parse_arg_str(&args, "--out").unwrap_or_else(|| "data/selfplay.bin".to_string());
    let max_turns = parse_arg(&args, "--max-turns").unwrap_or(200);
    let epsilon: f64 = parse_arg_f64(&args, "--epsilon").unwrap_or(0.1);
    let model_path = parse_arg_str(&args, "--model");

    let use_neural = model_path.is_some();
    println!("Self-play: {num_games} games, epsilon={epsilon}");
    if use_neural {
        println!("  Mode: Neural vs Greedy");
    } else {
        println!("  Mode: Greedy vs Greedy (bootstrap)");
    }
    println!("  Output: {out_path}");

    let device = Device::cuda_if_available();

    let model = if let Some(ref path) = model_path {
        let mut vs = nn::VarStore::new(device);
        let m = QwirkleNet::new(&vs);
        load_model(&mut vs, path).expect("Failed to load model");
        println!("  Model loaded from {path}");
        Some((vs, m))
    } else {
        None
    };

    let mut all_samples: Vec<Sample> = Vec::new();
    let mut rng = rand::thread_rng();

    for game_idx in 0..num_games {
        let neural_player = if use_neural {
            Some(game_idx % 2)
        } else {
            None
        };

        let samples = play_one_game(
            model.as_ref().map(|(_, m)| m),
            neural_player,
            &mut rng,
            max_turns,
            epsilon,
            device,
        );
        all_samples.extend(samples);

        if (game_idx + 1) % 100 == 0 {
            println!("  [{}/{}] samples: {}", game_idx + 1, num_games, all_samples.len());
        }
    }

    println!("Total samples: {}", all_samples.len());

    if let Some(parent) = Path::new(&out_path).parent() {
        fs::create_dir_all(parent).ok();
    }
    save_samples(&out_path, &all_samples).expect("Failed to save samples");
    let size = fs::metadata(&out_path).map(|m| m.len()).unwrap_or(0);
    println!("Saved to {out_path} ({:.1} MB)", size as f64 / 1_048_576.0);
}

fn play_one_game(
    model: Option<&QwirkleNet>,
    neural_player: Option<usize>,
    rng: &mut impl Rng,
    max_turns: usize,
    epsilon: f64,
    device: Device,
) -> Vec<Sample> {
    let mut bag = TileFace::full_bag();
    bag.shuffle(rng);

    let mut players = [
        SimPlayer {
            rack: Vec::new(), score: 0,
            use_neural: neural_player == Some(0),
            samples: Vec::new(),
        },
        SimPlayer {
            rack: Vec::new(), score: 0,
            use_neural: neural_player == Some(1),
            samples: Vec::new(),
        },
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
            .rack.iter().enumerate()
            .map(|(i, &face)| RackTile { face, rack_position: i as u8 })
            .collect();

        let moves = best_moves(&board, &rack_tiles);

        if moves.is_empty() {
            consecutive_passes += 1;
            if consecutive_passes >= 4 { break; }
            let hand = players[current].rack.clone();
            for tile in &hand { bag.push(*tile); }
            players[current].rack.clear();
            bag.shuffle(rng);
            let n = hand.len().min(bag.len());
            for _ in 0..n {
                if let Some(t) = bag.pop() { players[current].rack.push(t); }
            }
            current = 1 - current;
            continue;
        }
        consecutive_passes = 0;

        // Record state
        let opponent = 1 - current;
        let nodes = extract_nodes(&board, &[]);
        let (feat_tensor, mask_tensor) = nodes_to_tensor(&nodes, &board);
        let action_mask_tensor = build_action_mask(&nodes, &board, &players[current].rack);

        let feat_vec: Vec<f32> = Vec::<f32>::try_from(feat_tensor.flatten(0, -1)).unwrap();
        let mask_bool: Vec<u8> = Vec::<i64>::try_from(mask_tensor.to_kind(Kind::Int64))
            .unwrap().iter().map(|&v| v as u8).collect();
        let amask_flat: Vec<i64> = Vec::<i64>::try_from(
            action_mask_tensor.flatten(0, -1).to_kind(Kind::Int64)
        ).unwrap();
        let action_mask_bits = bitpack(&amask_flat);

        let ctx = [
            bag.len() as f32 / 108.0,
            players[current].score as f32 / 200.0,
            players[opponent].score as f32 / 200.0,
            players[current].rack.len() as f32 / 6.0,
        ];

        // Choose move
        let chosen_idx = if players[current].use_neural && model.is_some() {
            neural_pick(model.unwrap(), &board, &moves, &players, current, bag.len(), device, rng, epsilon)
        } else if rng.gen::<f64>() < epsilon && moves.len() > 1 {
            rng.gen_range(0..moves.len())
        } else {
            0
        };

        let chosen = &moves[chosen_idx];

        // Encode action as flat index
        let action_index = if let Some(first_tile) = chosen.tiles.first() {
            let mut idx = u32::MAX;
            for (ni, node) in nodes.iter().enumerate() {
                if node.coordinate == first_tile.coordinate && node.is_candidate {
                    let fi = tile_face_index(&first_tile.face);
                    idx = (ni * NUM_TILE_FACES as usize + fi) as u32;
                    break;
                }
            }
            idx
        } else {
            u32::MAX
        };

        players[current].samples.push(PendingSample {
            features: feat_vec,
            mask: mask_bool,
            context: ctx,
            action_mask_bits,
            action_index,
        });

        // Apply move
        players[current].score += chosen.score;
        for placed in &chosen.tiles {
            board.push(*placed);
            if let Some(pos) = players[current].rack.iter().position(|&f| f == placed.face) {
                players[current].rack.remove(pos);
            }
        }
        let n = chosen.tiles.len();
        for _ in 0..n {
            if let Some(t) = bag.pop() { players[current].rack.push(t); }
        }

        if players[current].rack.is_empty() && bag.is_empty() {
            players[current].score += 6;
            break;
        }

        current = 1 - current;
    }

    // Label with outcome
    let diff = players[0].score - players[1].score;
    let outcome_0: f32 = if diff > 0 { 1.0 } else if diff < 0 { -1.0 } else { 0.0 };

    let mut out = Vec::new();
    for (pi, player) in players.iter().enumerate() {
        let outcome = if pi == 0 { outcome_0 } else { -outcome_0 };
        for s in &player.samples {
            out.push(Sample {
                features: s.features.clone(),
                mask: s.mask.clone(),
                context: s.context,
                action_mask_bits: s.action_mask_bits.clone(),
                action_index: s.action_index,
                value: outcome,
            });
        }
    }
    out
}

fn neural_pick(
    model: &QwirkleNet,
    board: &[BoardTile],
    moves: &[ScoredMove],
    players: &[SimPlayer; 2],
    current: usize,
    bag_remaining: usize,
    device: Device,
    rng: &mut impl Rng,
    epsilon: f64,
) -> usize {
    if rng.gen::<f64>() < epsilon && moves.len() > 1 {
        return rng.gen_range(0..moves.len());
    }

    let opponent = 1 - current;
    let mut best_value = f64::NEG_INFINITY;
    let mut best_idx = 0;

    for (i, m) in moves.iter().enumerate() {
        let mut new_board = board.to_vec();
        new_board.extend_from_slice(&m.tiles);

        let nodes = extract_nodes(&new_board, &[]);
        let (feat, mask) = nodes_to_tensor(&nodes, &new_board);

        let ctx = GameContext {
            bag_remaining: bag_remaining as f32,
            player_score: (players[current].score + m.score) as f32,
            opponent_score: players[opponent].score as f32,
            rack_size: (players[current].rack.len() - m.tiles.len()) as f32,
        };

        let feat_b = feat.unsqueeze(0).to(device);
        let mask_b = mask.unsqueeze(0).to(device);
        let ctx_t = ctx.to_tensor().unsqueeze(0).to(device);

        let value = model.forward_value(&feat_b, &mask_b, &ctx_t, false);
        let v = f64::try_from(&value.squeeze_dim(0).squeeze_dim(0)).unwrap_or(0.0);
        let combined = m.score as f64 * 0.1 + v;

        if combined > best_value {
            best_value = combined;
            best_idx = i;
        }
    }

    best_idx
}

// ── Compact binary format v3 ──
// Header: u32 version=3, u64 num_samples
// Per sample:
//   features: [MAX_NODES * INPUT_DIM] f32 (raw, fixed size)
//   mask: [MAX_NODES] u8
//   context: [4] f32
//   action_mask_bits: [ceil(MAX_NODES*36/8)] u8 = 576 bytes
//   action_index: u32
//   value: f32

const FORMAT_VERSION: u32 = 3;
const FEAT_SIZE: usize = (MAX_NODES * INPUT_DIM) as usize;   // 2816
const MASK_SIZE: usize = MAX_NODES as usize;                  // 128
const AMASK_BITS: usize = (MAX_NODES * NUM_TILE_FACES) as usize; // 4608
const AMASK_BYTES: usize = (AMASK_BITS + 7) / 8;              // 576

fn save_samples(path: &str, samples: &[Sample]) -> std::io::Result<()> {
    let mut file = fs::File::create(path)?;

    file.write_all(&FORMAT_VERSION.to_le_bytes())?;
    file.write_all(&(samples.len() as u64).to_le_bytes())?;

    for s in samples {
        // features (fixed size)
        for &f in &s.features {
            file.write_all(&f.to_le_bytes())?;
        }
        // mask
        file.write_all(&s.mask)?;
        // context
        for &c in &s.context {
            file.write_all(&c.to_le_bytes())?;
        }
        // action_mask bitpacked
        file.write_all(&s.action_mask_bits)?;
        // action_index
        file.write_all(&s.action_index.to_le_bytes())?;
        // value
        file.write_all(&s.value.to_le_bytes())?;
    }

    Ok(())
}

pub fn load_samples(path: &str) -> std::io::Result<Vec<Sample>> {
    let data = fs::read(path)?;
    let mut c = 0usize;

    let version = r_u32(&data, &mut c);
    assert!(version == FORMAT_VERSION, "Expected v{FORMAT_VERSION}, got v{version}");

    let num = r_u64(&data, &mut c) as usize;
    let mut samples = Vec::with_capacity(num);

    for _ in 0..num {
        let mut features = Vec::with_capacity(FEAT_SIZE);
        for _ in 0..FEAT_SIZE { features.push(r_f32(&data, &mut c)); }

        let mask = data[c..c + MASK_SIZE].to_vec();
        c += MASK_SIZE;

        let context = [
            r_f32(&data, &mut c), r_f32(&data, &mut c),
            r_f32(&data, &mut c), r_f32(&data, &mut c),
        ];

        let action_mask_bits = data[c..c + AMASK_BYTES].to_vec();
        c += AMASK_BYTES;

        let action_index = r_u32(&data, &mut c);
        let value = r_f32(&data, &mut c);

        samples.push(Sample { features, mask, context, action_mask_bits, action_index, value });
    }

    Ok(samples)
}

// ── Helpers ──

fn bitpack(bools: &[i64]) -> Vec<u8> {
    let n_bytes = (bools.len() + 7) / 8;
    let mut bytes = vec![0u8; n_bytes];
    for (i, &b) in bools.iter().enumerate() {
        if b != 0 {
            bytes[i / 8] |= 1 << (i % 8);
        }
    }
    bytes
}

fn r_u64(d: &[u8], c: &mut usize) -> u64 {
    let v = u64::from_le_bytes(d[*c..*c+8].try_into().unwrap()); *c += 8; v
}
fn r_u32(d: &[u8], c: &mut usize) -> u32 {
    let v = u32::from_le_bytes(d[*c..*c+4].try_into().unwrap()); *c += 4; v
}
fn r_f32(d: &[u8], c: &mut usize) -> f32 {
    let v = f32::from_le_bytes(d[*c..*c+4].try_into().unwrap()); *c += 4; v
}

fn parse_arg(args: &[String], name: &str) -> Option<usize> {
    args.iter().position(|a| a == name).and_then(|i| args.get(i + 1)).and_then(|v| v.parse().ok())
}
fn parse_arg_f64(args: &[String], name: &str) -> Option<f64> {
    args.iter().position(|a| a == name).and_then(|i| args.get(i + 1)).and_then(|v| v.parse().ok())
}
fn parse_arg_str(args: &[String], name: &str) -> Option<String> {
    args.iter().position(|a| a == name).and_then(|i| args.get(i + 1)).cloned()
}
