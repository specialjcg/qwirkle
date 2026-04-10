//! Quick benchmark: rollout bot vs greedy on N games.
//! Usage: cargo run --release --bin bench_rollout -- --games 50

use std::time::Instant;
use rand::seq::SliceRandom;
use rand::thread_rng;

use qwirkle_backend::domain::ai::best_moves;
use qwirkle_backend::domain::rollout_bot::{rollout_best_move, DEFAULT_K_ROLLOUTS, DEFAULT_ROLLOUT_DEPTH};
use qwirkle_backend::domain::tile::{BoardTile, RackTile, TileFace};

fn main() {
    let args: Vec<String> = std::env::args().collect();
    let n_games: usize = args.iter()
        .position(|a| a == "--games")
        .and_then(|i| args.get(i + 1))
        .and_then(|v| v.parse().ok())
        .unwrap_or(20);
    let k: usize = args.iter()
        .position(|a| a == "--k")
        .and_then(|i| args.get(i + 1))
        .and_then(|v| v.parse().ok())
        .unwrap_or(DEFAULT_K_ROLLOUTS);
    let depth: usize = args.iter()
        .position(|a| a == "--depth")
        .and_then(|i| args.get(i + 1))
        .and_then(|v| v.parse().ok())
        .unwrap_or(DEFAULT_ROLLOUT_DEPTH);

    println!("Rollout bot vs Greedy");
    println!("  games:  {n_games}");
    println!("  K:      {k}");
    println!("  depth:  {depth}");
    println!();

    let mut rollout_wins = 0;
    let mut draws = 0;
    let mut total_rollout = 0;
    let mut total_greedy = 0;
    let mut total_move_time = 0.0;
    let mut total_moves = 0;
    let t0 = Instant::now();

    for game_idx in 0..n_games {
        let rollout_first = game_idx % 2 == 0;
        let (sr, sg, mt, mc) = play_one_game(rollout_first, k, depth);
        total_rollout += sr;
        total_greedy += sg;
        total_move_time += mt;
        total_moves += mc;

        if sr > sg { rollout_wins += 1; }
        else if sr == sg { draws += 1; }

        if (game_idx + 1) % 5 == 0 {
            let win_pct = (rollout_wins as f64 + 0.5 * draws as f64) / (game_idx + 1) as f64 * 100.0;
            let avg_ms = total_move_time / total_moves as f64 * 1000.0;
            println!("  [{}/{}] win={:.1}% avg_score: rollout {:.0} vs greedy {:.0} | avg move: {:.0}ms",
                game_idx + 1, n_games, win_pct,
                total_rollout as f64 / (game_idx + 1) as f64,
                total_greedy as f64 / (game_idx + 1) as f64,
                avg_ms);
        }
    }

    let elapsed = t0.elapsed().as_secs_f64();
    let win_pct = (rollout_wins as f64 + 0.5 * draws as f64) / n_games as f64 * 100.0;
    let avg_ms = total_move_time / total_moves as f64 * 1000.0;

    println!();
    println!("=== Final ({n_games} games in {elapsed:.1}s) ===");
    println!("  Rollout: {rollout_wins} wins, {draws} draws (score: {win_pct:.1}%)");
    println!("  Avg score: rollout {:.1} vs greedy {:.1}",
        total_rollout as f64 / n_games as f64,
        total_greedy as f64 / n_games as f64);
    println!("  Avg move time: {avg_ms:.0}ms ({} moves total)", total_moves);
}

fn play_one_game(rollout_first: bool, k: usize, depth: usize) -> (i32, i32, f64, usize) {
    let mut rng = thread_rng();
    let mut bag = TileFace::full_bag();
    bag.shuffle(&mut rng);

    let mut racks: [Vec<TileFace>; 2] = [Vec::new(), Vec::new()];
    let mut scores = [0i32, 0];
    for player in &mut racks {
        for _ in 0..6 {
            if let Some(t) = bag.pop() { player.push(t); }
        }
    }

    let mut board: Vec<BoardTile> = Vec::new();
    let mut current = 0;
    let mut passes = 0;
    let mut rollout_time = 0.0;
    let mut rollout_moves = 0;

    for _ in 0..200 {
        let opp = 1 - current;
        let rack_tiles: Vec<RackTile> = racks[current].iter().enumerate()
            .map(|(i, &f)| RackTile { face: f, rack_position: i as u8 })
            .collect();

        let legal = best_moves(&board, &rack_tiles);
        if legal.is_empty() {
            passes += 1;
            if passes >= 4 { break; }
            let hand = racks[current].clone();
            for t in &hand { bag.push(*t); }
            racks[current].clear();
            bag.shuffle(&mut rng);
            for _ in 0..hand.len() {
                if let Some(t) = bag.pop() { racks[current].push(t); }
            }
            current = 1 - current;
            continue;
        }
        passes = 0;

        let is_rollout_turn = if rollout_first { current == 0 } else { current == 1 };

        let chosen = if is_rollout_turn {
            let t0 = Instant::now();
            let m = rollout_best_move(
                &board, &racks[current], &bag,
                scores[current], scores[opp], k, depth
            ).unwrap_or_else(|| legal[0].clone());
            rollout_time += t0.elapsed().as_secs_f64();
            rollout_moves += 1;
            m
        } else {
            legal[0].clone()
        };

        scores[current] += chosen.score;
        for placed in &chosen.tiles {
            board.push(*placed);
            if let Some(pos) = racks[current].iter().position(|&f| f == placed.face) {
                racks[current].remove(pos);
            }
        }
        for _ in 0..chosen.tiles.len() {
            if let Some(t) = bag.pop() { racks[current].push(t); }
        }

        if racks[current].is_empty() && bag.is_empty() {
            scores[current] += 6;
            break;
        }
        current = 1 - current;
    }

    let (r_score, g_score) = if rollout_first {
        (scores[0], scores[1])
    } else {
        (scores[1], scores[0])
    };
    (r_score, g_score, rollout_time, rollout_moves)
}
