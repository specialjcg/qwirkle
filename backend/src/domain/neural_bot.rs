//! Neural bot wrapper: loads model lazily, runs MCTS for move selection.
//! Feature-gated behind "neural".

use crate::domain::ai::ScoredMove;
use crate::domain::tile::{BoardTile, TileFace};

#[cfg(feature = "neural")]
use std::sync::{Mutex, OnceLock};
#[cfg(feature = "neural")]
use std::path::Path;

/// Default MCTS sims for in-game bot (kept low for CPU latency).
pub const DEFAULT_MCTS_SIMS: u32 = 30;

/// Default model path for the neural bot.
pub const DEFAULT_MODEL_PATH: &str = "models/v1.pt";

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

        let device = tch::Device::cuda_if_available();
        let mut vs = tch::nn::VarStore::new(device);
        let model = crate::neural::graph_transformer::QwirkleNet::new(&vs);
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

/// Pick a move using MCTS guided by the neural network.
/// Returns None if model is not loaded or no legal moves.
#[cfg(feature = "neural")]
pub fn mcts_best_move(
    board: &[BoardTile],
    rack: &[TileFace],
    bag_remaining: usize,
    player_score: i32,
    opponent_score: i32,
    n_sims: u32,
) -> Option<ScoredMove> {
    let state_mutex = NEURAL_STATE.get()?.as_ref()?;
    let state = state_mutex.lock().ok()?;

    let _no_grad = tch::no_grad_guard();
    let root = crate::neural::mcts::MCTSNode::new_root(
        board.to_vec(),
        rack.to_vec(),
        bag_remaining,
        player_score,
        opponent_score,
    );
    let mut mcts = crate::neural::mcts::MCTS::new(root, state.device);
    mcts.search(&state.model, n_sims);
    mcts.best_move()
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
