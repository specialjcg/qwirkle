//! Neural bot wrapper: loads model lazily, runs MCTS for move selection.
//! Feature-gated behind "neural".

use crate::domain::ai::ScoredMove;
use crate::domain::tile::{BoardTile, TileFace};

#[cfg(feature = "neural")]
use std::sync::{Mutex, OnceLock};
#[cfg(feature = "neural")]
use std::path::Path;

/// Default MCTS sims for in-game bot.
/// 100 sims ≈ 1s latency on CPU but significantly stronger than 30.
pub const DEFAULT_MCTS_SIMS: u32 = 100;

/// Default model path for the neural bot.
pub const DEFAULT_MODEL_PATH: &str = "models/v7_large_az_best.pt";

#[cfg(feature = "neural")]
struct NeuralBotState {
    vs: tch::nn::VarStore,
    model: crate::neural::graph_transformer::QwirkleNet,
    device: tch::Device,
}

#[cfg(feature = "neural")]
static NEURAL_STATE: OnceLock<Option<Mutex<NeuralBotState>>> = OnceLock::new();

/// Initialize the neural bot (load model). Idempotent.
#[cfg(feature = "neural")]
pub fn ensure_loaded() -> bool {
    NEURAL_STATE.get_or_init(|| {
        let model_path = std::env::var("QWIRKLE_MODEL").unwrap_or_else(|_| DEFAULT_MODEL_PATH.to_string());
        if !Path::new(&model_path).exists() {
            tracing::warn!("Neural model not found at {model_path}, neural bot disabled");
            return None;
        }

        // Detect model config from env or model path
        let net_cfg = match std::env::var("QWIRKLE_MODEL_CONFIG").as_deref() {
            Ok("large") => crate::neural::graph_transformer::NetConfig::LARGE,
            Ok("student") => crate::neural::graph_transformer::NetConfig::STUDENT,
            _ => {
                // Auto-detect: if path contains "large", use LARGE; "student" → STUDENT
                if model_path.contains("large") {
                    crate::neural::graph_transformer::NetConfig::LARGE
                } else if model_path.contains("student") {
                    crate::neural::graph_transformer::NetConfig::STUDENT
                } else {
                    crate::neural::graph_transformer::NetConfig::TEACHER
                }
            }
        };

        let device = tch::Device::cuda_if_available();
        let mut vs = tch::nn::VarStore::new(device);
        let model = crate::neural::graph_transformer::QwirkleNet::new_with_config(&vs, net_cfg);
        match crate::neural::model_io::load_model(&mut vs, &model_path) {
            Ok(_) => {
                tracing::info!("Neural bot loaded from {model_path} on {:?}", device);
                Some(Mutex::new(NeuralBotState { vs, model, device }))
            }
            Err(e) => {
                tracing::warn!("Failed to load neural model: {e}");
                None
            }
        }
    }).is_some()
}

#[cfg(not(feature = "neural"))]
pub fn ensure_loaded() -> bool {
    false
}

/// Pick a move using value-based ranking with greedy bias.
/// Until the policy network is strong enough to outperform greedy, we:
///   1. Get the top-K legal moves (sorted by score, descending)
///   2. Re-rank them using `score * 0.5 + value(resulting_state)`
///   3. Pick the best
/// This stays close to greedy but allows the value head to nudge.
#[cfg(feature = "neural")]
pub fn mcts_best_move(
    board: &[BoardTile],
    rack: &[TileFace],
    bag_remaining: usize,
    player_score: i32,
    opponent_score: i32,
    _n_sims: u32,
) -> Option<ScoredMove> {
    use crate::domain::tile::RackTile;
    use crate::neural::tensor_conversion::{
        compute_bag_distribution, compute_rack_distribution, extract_nodes, nodes_to_tensor, GameContext,
    };

    let state_mutex = NEURAL_STATE.get()?.as_ref()?;
    let state = state_mutex.lock().ok()?;

    let _no_grad = tch::no_grad_guard();

    // Get legal moves
    let rack_tiles: Vec<RackTile> = rack
        .iter()
        .enumerate()
        .map(|(i, &face)| RackTile { face, rack_position: i as u8 })
        .collect();
    let legal_moves = crate::domain::ai::best_moves(board, &rack_tiles);

    if legal_moves.is_empty() {
        return None;
    }
    if legal_moves.len() == 1 {
        return Some(legal_moves[0].clone());
    }

    // Evaluate each move with value head
    let mut best_combined = f64::NEG_INFINITY;
    let mut best_idx = 0;

    for (i, m) in legal_moves.iter().enumerate() {
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
            player_score: (player_score + m.score) as f32,
            opponent_score: opponent_score as f32,
            rack_size: new_rack.len() as f32,
            bag_distribution: compute_bag_distribution(&new_board, &new_rack),
            rack_distribution: compute_rack_distribution(&new_rack),
        };

        let feat_b = feat.unsqueeze(0).to(state.device);
        let mask_b = mask.unsqueeze(0).to(state.device);
        let ctx_b = ctx.to_tensor().unsqueeze(0).to(state.device);

        let value = state.model.forward_value(&feat_b, &mask_b, &ctx_b, false);
        let v = f64::try_from(&value.squeeze_dim(0).squeeze_dim(0)).unwrap_or(0.0);

        // Heavy weight on immediate score (greedy bias) + small value contribution
        let combined = m.score as f64 * 0.5 + v;

        if combined > best_combined {
            best_combined = combined;
            best_idx = i;
        }
    }

    Some(legal_moves[best_idx].clone())
}

#[cfg(not(feature = "neural"))]
pub fn mcts_best_move(
    _board: &[BoardTile],
    _rack: &[TileFace],
    _bag_remaining: usize,
    _player_score: i32,
    _opponent_score: i32,
    _n_sims: u32,
) -> Option<ScoredMove> {
    None
}

/// Determine bot type from pseudo:
/// - "bot1" or "bot" → greedy
/// - "bot2" → neural+MCTS
/// - others starting with "bot" → greedy fallback
pub enum BotKind {
    Greedy,
    NeuralMcts,
}

pub fn bot_kind_from_pseudo(pseudo: &str) -> BotKind {
    match pseudo {
        "bot2" => BotKind::NeuralMcts,
        _ => BotKind::Greedy,
    }
}
