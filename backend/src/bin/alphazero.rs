//! AlphaZero-style training loop for Qwirkle.
//!
//! Iteration:
//!   1. Self-play with MCTS guided by current best model → samples
//!   2. Train on samples → candidate model
//!   3. Arena: candidate vs best (N games)
//!   4. If candidate wins >55%, candidate becomes new best
//!   5. Repeat
//!
//! Usage:
//!   cargo run --features neural --release --bin alphazero -- \
//!     --iterations 20 --selfplay-games 200 --mcts-sims 100 \
//!     --arena-games 40 --out-dir models/az

use std::fs;
use std::io::Write;
use std::path::Path;
use std::time::Instant;

use rand::seq::SliceRandom;
use rand::{thread_rng, Rng};
use tch::{nn, Device};

use qwirkle_backend::domain::ai::best_moves;
use qwirkle_backend::domain::tile::{BoardTile, RackTile, TileFace};
use qwirkle_backend::neural::graph_transformer::QwirkleNet;
use qwirkle_backend::neural::mcts::{MCTSNode, MCTS};
use qwirkle_backend::neural::model_io::{load_model, save_model};
use qwirkle_backend::neural::tensor_conversion::{
    build_action_mask, compute_bag_distribution, extract_nodes, nodes_to_tensor, tile_face_index,
};

fn main() {
    let args: Vec<String> = std::env::args().collect();
    let iterations = parse_arg(&args, "--iterations").unwrap_or(100);
    let selfplay_games = parse_arg(&args, "--selfplay-games").unwrap_or(100);
    let mcts_sims = parse_arg(&args, "--mcts-sims").unwrap_or(50);
    let arena_games = parse_arg(&args, "--arena-games").unwrap_or(30);
    let win_threshold = parse_arg_f64(&args, "--win-threshold").unwrap_or(0.55);
    let out_dir = parse_arg_str(&args, "--out-dir").unwrap_or_else(|| "models/az".to_string());
    let init_model = parse_arg_str(&args, "--init-model");
    let eval_every = parse_arg(&args, "--eval-every").unwrap_or(2);
    let eval_games = parse_arg(&args, "--eval-games").unwrap_or(40);
    let target_greedy_winrate = parse_arg_f64(&args, "--target-greedy-winrate").unwrap_or(1.0);

    println!("AlphaZero training:");
    println!("  iterations:        {iterations}");
    println!("  selfplay/iter:     {selfplay_games}");
    println!("  mcts sims:         {mcts_sims}");
    println!("  arena games:       {arena_games}");
    println!("  win threshold:     {win_threshold}");
    println!("  eval every:        {eval_every} iters");
    println!("  eval games:        {eval_games}");
    println!("  target greedy:     {:.0}%", target_greedy_winrate * 100.0);
    println!("  out dir:           {out_dir}");

    fs::create_dir_all(&out_dir).expect("create out dir");

    let device = Device::cuda_if_available();
    println!("  device:         {:?}\n", device);

    // Initialize best model
    let best_path = format!("{out_dir}/best.pt");
    let mut best_vs = nn::VarStore::new(device);
    let _best_model = QwirkleNet::new(&best_vs);

    if let Some(init) = init_model {
        println!("Loading initial model from {init}");
        load_model(&mut best_vs, &init).expect("load init model");
        save_model(&best_vs, &best_path).expect("save initial best");
    } else if Path::new(&best_path).exists() {
        println!("Resuming from existing {best_path}");
        load_model(&mut best_vs, &best_path).expect("load best");
    } else {
        println!("Starting from random initialization");
        save_model(&best_vs, &best_path).expect("save initial best");
    }

    let mut best_greedy_winrate = 0.0;

    for iter in 1..=iterations {
        println!("=== Iteration {iter}/{iterations} ===");
        let t0 = Instant::now();

        // 1. Self-play with current best model
        println!("  [1/3] Self-play ({selfplay_games} games, {mcts_sims} MCTS sims)...");
        let best_model_iter = QwirkleNet::new(&best_vs);
        let samples_path = format!("{out_dir}/iter{iter}_samples.bin");
        run_selfplay(
            &best_model_iter,
            selfplay_games,
            mcts_sims as u32,
            device,
            &samples_path,
        );

        // 2. Train candidate
        println!("  [2/3] Training candidate...");
        let candidate_path = format!("{out_dir}/iter{iter}_candidate.pt");
        train_candidate(&samples_path, &best_path, &candidate_path, device);

        // 3. Arena
        println!("  [3/3] Arena: candidate vs best ({arena_games} games)...");
        let mut cand_vs = nn::VarStore::new(device);
        let cand_model = QwirkleNet::new(&cand_vs);
        load_model(&mut cand_vs, &candidate_path).expect("load candidate");

        let best_model_arena = QwirkleNet::new(&best_vs);

        let win_rate = arena(&cand_model, &best_model_arena, arena_games, (mcts_sims / 2) as u32, device);
        println!("    candidate win rate: {:.1}%", win_rate * 100.0);

        if win_rate >= win_threshold {
            println!("    -> Candidate accepted as new best!");
            fs::copy(&candidate_path, &best_path).expect("copy best");
            best_vs = cand_vs; // promote
        } else {
            println!("    -> Candidate rejected, keeping best");
        }

        // Periodic eval vs greedy
        if iter % eval_every == 0 {
            println!("  [eval] Best vs Greedy ({eval_games} games)...");
            let best_for_eval = QwirkleNet::new(&best_vs);
            best_greedy_winrate = eval_vs_greedy(&best_for_eval, eval_games, mcts_sims as u32, device);
            println!("    >> best vs greedy: {:.1}%", best_greedy_winrate * 100.0);

            // Save snapshot with winrate in name
            let snapshot = format!("{out_dir}/best_iter{iter}_g{:.0}.pt", best_greedy_winrate * 100.0);
            fs::copy(&best_path, &snapshot).ok();

            if best_greedy_winrate >= target_greedy_winrate {
                println!("\n🎯 Target reached! best vs greedy = {:.1}% >= {:.0}%",
                    best_greedy_winrate * 100.0, target_greedy_winrate * 100.0);
                break;
            }
        }

        // Cleanup intermediate samples to save disk
        let _ = fs::remove_file(&samples_path);
        let _ = fs::remove_file(&candidate_path);

        let elapsed = t0.elapsed().as_secs_f64();
        println!("  iteration done in {elapsed:.1}s | best_vs_greedy={:.1}%\n",
            best_greedy_winrate * 100.0);
    }

    println!("\nAlphaZero training complete.");
    println!("  best model:        {best_path}");
    println!("  best vs greedy:    {:.1}%", best_greedy_winrate * 100.0);
}

/// Evaluate a neural model against the greedy bot. Returns win rate of neural.
fn eval_vs_greedy(model: &QwirkleNet, n_games: usize, mcts_sims: u32, device: Device) -> f64 {
    let mut wins = 0;
    let mut draws = 0;
    let mut rng = thread_rng();

    for game_idx in 0..n_games {
        let neural_first = game_idx % 2 == 0;
        let (n_score, g_score) = play_neural_vs_greedy(model, neural_first, mcts_sims, device, &mut rng);
        if n_score > g_score {
            wins += 1;
        } else if n_score == g_score {
            draws += 1;
        }
    }
    (wins as f64 + 0.5 * draws as f64) / n_games as f64
}

fn play_neural_vs_greedy(
    model: &QwirkleNet,
    neural_first: bool,
    mcts_sims: u32,
    device: Device,
    rng: &mut impl Rng,
) -> (i32, i32) {
    use qwirkle_backend::neural::mcts::{MCTSNode, MCTS};

    let mut bag = TileFace::full_bag();
    bag.shuffle(rng);

    let mut racks: [Vec<TileFace>; 2] = [Vec::new(), Vec::new()];
    let mut scores = [0i32, 0];
    for player in &mut racks {
        for _ in 0..6 {
            if let Some(t) = bag.pop() { player.push(t); }
        }
    }

    let mut board = Vec::new();
    let mut current = 0usize;
    let mut passes = 0;

    for _ in 0..200 {
        let opp = 1 - current;
        let rack_tiles: Vec<RackTile> = racks[current]
            .iter()
            .enumerate()
            .map(|(i, &f)| RackTile { face: f, rack_position: i as u8 })
            .collect();

        let legal = best_moves(&board, &rack_tiles);
        if legal.is_empty() {
            passes += 1;
            if passes >= 4 { break; }
            let hand = racks[current].clone();
            for t in &hand { bag.push(*t); }
            racks[current].clear();
            bag.shuffle(rng);
            for _ in 0..hand.len() {
                if let Some(t) = bag.pop() { racks[current].push(t); }
            }
            current = 1 - current;
            continue;
        }
        passes = 0;

        // 0 = neural if neural_first else greedy
        let is_neural_turn = if neural_first { current == 0 } else { current == 1 };

        let chosen = if is_neural_turn {
            // Use MCTS to pick neural's move
            let root = MCTSNode::new_root(
                board.clone(),
                racks[current].clone(),
                bag.len(),
                scores[current],
                scores[opp],
            );
            let mut mcts = MCTS::new(root, device);
            mcts.search(model, mcts_sims);
            mcts.best_move().unwrap_or_else(|| legal[0].clone())
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

    if neural_first {
        (scores[0], scores[1])
    } else {
        (scores[1], scores[0])
    }
}

/// Run self-play games with MCTS, save samples.
fn run_selfplay(
    model: &QwirkleNet,
    n_games: usize,
    mcts_sims: u32,
    device: Device,
    out_path: &str,
) {
    let mut all_samples: Vec<SelfPlaySample> = Vec::new();
    let mut rng = thread_rng();

    for game_idx in 0..n_games {
        let samples = play_one_game_mcts(model, mcts_sims, device, &mut rng);
        all_samples.extend(samples);

        if (game_idx + 1) % 20 == 0 {
            println!("    [{}/{}] samples={}", game_idx + 1, n_games, all_samples.len());
        }
    }

    save_selfplay(out_path, &all_samples).expect("save selfplay");
}

#[derive(Clone)]
struct SelfPlaySample {
    nodes: Vec<f32>,        // [MAX_NODES * INPUT_DIM]
    mask: Vec<u8>,          // [MAX_NODES]
    context: [f32; 40],
    action_mask: Vec<u8>,   // bitpacked
    action_index: u32,      // best move from MCTS visits
    value: f32,             // game outcome from this player's POV
}

fn play_one_game_mcts(
    model: &QwirkleNet,
    mcts_sims: u32,
    device: Device,
    rng: &mut impl Rng,
) -> Vec<SelfPlaySample> {
    use qwirkle_backend::neural::graph_transformer::{MAX_NODES, NUM_TILE_FACES};
    use tch::Kind;

    let mut bag = TileFace::full_bag();
    bag.shuffle(rng);

    let mut racks: [Vec<TileFace>; 2] = [Vec::new(), Vec::new()];
    let mut scores = [0i32, 0];

    for player in &mut racks {
        for _ in 0..6 {
            if let Some(t) = bag.pop() {
                player.push(t);
            }
        }
    }

    let mut board: Vec<BoardTile> = Vec::new();
    let mut current = 0usize;
    let mut consecutive_passes = 0;
    let mut samples_per_player: [Vec<SelfPlaySample>; 2] = [Vec::new(), Vec::new()];

    for _turn in 0..200 {
        let opp = 1 - current;
        let rack_tiles: Vec<RackTile> = racks[current]
            .iter()
            .enumerate()
            .map(|(i, &face)| RackTile { face, rack_position: i as u8 })
            .collect();

        let legal = best_moves(&board, &rack_tiles);
        if legal.is_empty() {
            consecutive_passes += 1;
            if consecutive_passes >= 4 {
                break;
            }
            // Swap
            let hand = racks[current].clone();
            for t in &hand { bag.push(*t); }
            racks[current].clear();
            bag.shuffle(rng);
            for _ in 0..hand.len() {
                if let Some(t) = bag.pop() { racks[current].push(t); }
            }
            current = 1 - current;
            continue;
        }
        consecutive_passes = 0;

        // Run MCTS
        let root = MCTSNode::new_root(
            board.clone(),
            racks[current].clone(),
            bag.len(),
            scores[current],
            scores[opp],
        );
        let mut mcts = MCTS::new(root, device);
        mcts.search(model, mcts_sims);

        // Record state with MCTS-derived target
        let nodes = extract_nodes(&board, &[]);
        let (feat_t, mask_t) = nodes_to_tensor(&nodes, &board);
        let amask_t = build_action_mask(&nodes, &board, &racks[current]);

        let feat_vec: Vec<f32> = Vec::<f32>::try_from(feat_t.flatten(0, -1)).unwrap();
        let mask_vec: Vec<u8> = Vec::<i64>::try_from(mask_t.to_kind(Kind::Int64))
            .unwrap()
            .iter()
            .map(|&v| v as u8)
            .collect();
        let amask_flat: Vec<i64> = Vec::<i64>::try_from(
            amask_t.flatten(0, -1).to_kind(Kind::Int64)
        ).unwrap();
        let action_mask_bits = bitpack(&amask_flat);

        let bag_dist = compute_bag_distribution(&board, &racks[current]);
        let mut ctx = [0.0f32; 40];
        ctx[0] = bag.len() as f32 / 108.0;
        ctx[1] = scores[current] as f32 / 200.0;
        ctx[2] = scores[opp] as f32 / 200.0;
        ctx[3] = racks[current].len() as f32 / 6.0;
        ctx[4..40].copy_from_slice(&bag_dist);

        // Best move from MCTS visit counts
        let chosen = mcts.best_move().unwrap_or_else(|| legal[0].clone());

        let action_index = if let Some(first) = chosen.tiles.first() {
            let mut idx = u32::MAX;
            for (ni, n) in nodes.iter().enumerate() {
                if n.coordinate == first.coordinate && n.is_candidate {
                    idx = (ni * NUM_TILE_FACES as usize + tile_face_index(&first.face)) as u32;
                    break;
                }
            }
            idx
        } else {
            u32::MAX
        };

        samples_per_player[current].push(SelfPlaySample {
            nodes: feat_vec,
            mask: mask_vec,
            context: ctx,
            action_mask: action_mask_bits,
            action_index,
            value: 0.0, // filled at end
        });

        // Apply move
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

    // Reward shaping: continuous score-diff signal blended with binary outcome
    let diff = (scores[0] - scores[1]) as f32;
    let binary_0: f32 = if diff > 0.0 { 1.0 } else if diff < 0.0 { -1.0 } else { 0.0 };
    // Continuous: tanh(diff/30) gives smooth value in [-1, 1] sensitive to score gap
    let continuous_0: f32 = (diff / 30.0).tanh();
    // 70% continuous + 30% binary
    let value_0 = 0.7 * continuous_0 + 0.3 * binary_0;

    let mut all = Vec::new();
    for pi in 0..2 {
        let v = if pi == 0 { value_0 } else { -value_0 };
        for mut s in std::mem::take(&mut samples_per_player[pi]) {
            s.value = v;
            all.push(s);
        }
    }
    all
}

/// Train a candidate model from samples, starting from current best.
fn train_candidate(samples_path: &str, init_path: &str, out_path: &str, device: Device) {
    use std::process::Command;
    // Find train_bot binary in same directory as the current executable
    let train_bot_path = std::env::current_exe()
        .ok()
        .and_then(|p| p.parent().map(|d| d.join("train_bot")))
        .unwrap_or_else(|| std::path::PathBuf::from("./train_bot"));

    let status = Command::new(&train_bot_path)
        .args([
            "--data", samples_path,
            "--epochs", "20",
            "--batch", "128",
            "--lr", "0.0005",
            "--out", out_path,
            "--patience", "5",
            "--max-samples", "20000",
        ])
        .env("LD_LIBRARY_PATH", std::env::var("LD_LIBRARY_PATH").unwrap_or_default())
        .status()
        .expect("run train_bot");
    if !status.success() {
        eprintln!("Warning: train_bot returned non-zero");
    }
    let _ = (init_path, device); // could load init_path as warm start
}

/// Arena: candidate vs best, return win rate of candidate.
fn arena(
    candidate: &QwirkleNet,
    best: &QwirkleNet,
    n_games: usize,
    mcts_sims: u32,
    device: Device,
) -> f64 {
    let mut wins = 0;
    let mut draws = 0;
    let mut rng = thread_rng();

    for game_idx in 0..n_games {
        // Alternate who starts
        let cand_first = game_idx % 2 == 0;
        let (s0, s1) = play_arena_game(
            if cand_first { candidate } else { best },
            if cand_first { best } else { candidate },
            mcts_sims,
            device,
            &mut rng,
        );
        let cand_score = if cand_first { s0 } else { s1 };
        let best_score = if cand_first { s1 } else { s0 };

        if cand_score > best_score {
            wins += 1;
        } else if cand_score == best_score {
            draws += 1;
        }
    }

    (wins as f64 + 0.5 * draws as f64) / n_games as f64
}

fn play_arena_game(
    p0: &QwirkleNet,
    p1: &QwirkleNet,
    mcts_sims: u32,
    device: Device,
    rng: &mut impl Rng,
) -> (i32, i32) {
    let mut bag = TileFace::full_bag();
    bag.shuffle(rng);

    let mut racks: [Vec<TileFace>; 2] = [Vec::new(), Vec::new()];
    let mut scores = [0i32, 0];
    for player in &mut racks {
        for _ in 0..6 {
            if let Some(t) = bag.pop() { player.push(t); }
        }
    }

    let mut board = Vec::new();
    let mut current = 0usize;
    let mut passes = 0;

    for _ in 0..200 {
        let opp = 1 - current;
        let rack_tiles: Vec<RackTile> = racks[current]
            .iter()
            .enumerate()
            .map(|(i, &f)| RackTile { face: f, rack_position: i as u8 })
            .collect();

        let legal = best_moves(&board, &rack_tiles);
        if legal.is_empty() {
            passes += 1;
            if passes >= 4 { break; }
            // Swap
            let hand = racks[current].clone();
            for t in &hand { bag.push(*t); }
            racks[current].clear();
            bag.shuffle(rng);
            for _ in 0..hand.len() {
                if let Some(t) = bag.pop() { racks[current].push(t); }
            }
            current = 1 - current;
            continue;
        }
        passes = 0;

        let model = if current == 0 { p0 } else { p1 };
        let root = MCTSNode::new_root(
            board.clone(),
            racks[current].clone(),
            bag.len(),
            scores[current],
            scores[opp],
        );
        let mut mcts = MCTS::new(root, device);
        mcts.search(model, mcts_sims);
        let chosen = mcts.best_move().unwrap_or_else(|| legal[0].clone());

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

    (scores[0], scores[1])
}

// ── Serialization (same v3 format as selfplay.rs) ──

const FORMAT_VERSION: u32 = 4;

fn save_selfplay(path: &str, samples: &[SelfPlaySample]) -> std::io::Result<()> {
    let mut file = fs::File::create(path)?;
    file.write_all(&FORMAT_VERSION.to_le_bytes())?;
    file.write_all(&(samples.len() as u64).to_le_bytes())?;

    for s in samples {
        for &f in &s.nodes { file.write_all(&f.to_le_bytes())?; }
        file.write_all(&s.mask)?;
        for &c in &s.context { file.write_all(&c.to_le_bytes())?; }
        file.write_all(&s.action_mask)?;
        file.write_all(&s.action_index.to_le_bytes())?;
        file.write_all(&s.value.to_le_bytes())?;
    }
    Ok(())
}

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

fn parse_arg(args: &[String], name: &str) -> Option<usize> {
    args.iter().position(|a| a == name).and_then(|i| args.get(i + 1)).and_then(|v| v.parse().ok())
}
fn parse_arg_f64(args: &[String], name: &str) -> Option<f64> {
    args.iter().position(|a| a == name).and_then(|i| args.get(i + 1)).and_then(|v| v.parse().ok())
}
fn parse_arg_str(args: &[String], name: &str) -> Option<String> {
    args.iter().position(|a| a == name).and_then(|i| args.get(i + 1)).cloned()
}
