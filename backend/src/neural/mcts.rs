//! Monte Carlo Tree Search guided by a neural network policy + value.
//!
//! AlphaZero-style MCTS adapted for Qwirkle (imperfect information):
//! - Each rollout uses a "determinization" of the hidden state (bag, opponent rack)
//! - PUCB selection: argmax Q + c_puct * P * sqrt(N_parent) / (1 + N_child)
//!
//! Action space: legal moves enumerated by `domain::ai::best_moves`.
//! Each child node corresponds to one of those moves.

#![cfg(feature = "neural")]

use rand::seq::SliceRandom;
use rand::Rng;
use tch::{Device, Kind, Tensor};

use crate::domain::ai::{best_moves, ScoredMove};
use crate::domain::tile::{BoardTile, RackTile, TileFace};
use super::graph_transformer::{QwirkleNet, MAX_NODES, NUM_TILE_FACES};
use super::tensor_conversion::{
    compute_bag_distribution, extract_nodes, nodes_to_tensor, tile_face_index, GameContext,
};

/// PUCB exploration constant.
pub const C_PUCT: f32 = 1.5;

/// A child entry in an MCTS node: legal move + NN prior + child node index.
#[derive(Clone)]
pub struct MCTSChild {
    pub mv: ScoredMove,
    pub prior: f32,
    pub child_idx: i32, // -1 if not yet created
}

/// A node in the MCTS tree.
pub struct MCTSNode {
    pub board: Vec<BoardTile>,
    pub rack: Vec<TileFace>,
    pub bag_remaining: usize,
    pub player_score: i32,
    pub opponent_score: i32,
    pub is_my_turn: bool,

    pub visits: u32,
    pub value_sum: f32,
    pub prior: f32,

    /// Legal moves with prior and child node index (-1 if not yet expanded).
    pub children: Vec<MCTSChild>,
    pub expanded: bool,
}

impl MCTSNode {
    pub fn new_root(
        board: Vec<BoardTile>,
        rack: Vec<TileFace>,
        bag_remaining: usize,
        player_score: i32,
        opponent_score: i32,
    ) -> Self {
        Self {
            board,
            rack,
            bag_remaining,
            player_score,
            opponent_score,
            is_my_turn: true,
            visits: 0,
            value_sum: 0.0,
            prior: 1.0,
            children: Vec::new(),
            expanded: false,
        }
    }

    pub fn q_value(&self) -> f32 {
        if self.visits == 0 {
            0.0
        } else {
            self.value_sum / self.visits as f32
        }
    }

    /// PUCB score for child selection.
    pub fn pucb(&self, parent_visits: u32) -> f32 {
        let q = self.q_value();
        let u = C_PUCT * self.prior * (parent_visits as f32).sqrt() / (1.0 + self.visits as f32);
        q + u
    }
}

/// MCTS tree (arena of nodes).
pub struct MCTS {
    pub nodes: Vec<MCTSNode>,
    pub device: Device,
}

impl MCTS {
    pub fn new(root: MCTSNode, device: Device) -> Self {
        Self {
            nodes: vec![root],
            device,
        }
    }

    /// Run N simulations from the root.
    pub fn search(&mut self, model: &QwirkleNet, n_simulations: u32) {
        for _ in 0..n_simulations {
            let _ = self.simulate(0, model);
        }
    }

    /// One MCTS simulation: select → expand → evaluate → backup.
    /// Returns the value from the current node's perspective.
    fn simulate(&mut self, node_idx: usize, model: &QwirkleNet) -> f32 {
        if self.nodes[node_idx].rack.is_empty() {
            return 0.0;
        }

        // Expand on first visit
        if !self.nodes[node_idx].expanded {
            let value = self.expand_and_evaluate(node_idx, model);
            self.nodes[node_idx].visits += 1;
            self.nodes[node_idx].value_sum += value;
            return value;
        }

        // Select best child via PUCB
        let parent_visits = self.nodes[node_idx].visits;
        let n_children = self.nodes[node_idx].children.len();
        if n_children == 0 {
            return 0.0;
        }

        let mut best_idx = 0;
        let mut best_score = f32::NEG_INFINITY;

        for ci in 0..n_children {
            let child = &self.nodes[node_idx].children[ci];
            let score = if child.child_idx < 0 {
                // Unexpanded: Q=0, only U term
                C_PUCT * child.prior * (parent_visits as f32).sqrt()
            } else {
                let q = self.nodes[child.child_idx as usize].q_value();
                let u = C_PUCT * child.prior * (parent_visits as f32).sqrt()
                    / (1.0 + self.nodes[child.child_idx as usize].visits as f32);
                q + u
            };

            if score > best_score {
                best_score = score;
                best_idx = ci;
            }
        }

        // Expand selected child if needed
        let chosen = self.nodes[node_idx].children[best_idx].clone();
        let child_node_idx = if chosen.child_idx < 0 {
            let new_idx = self.create_child(node_idx, &chosen.mv);
            self.nodes[node_idx].children[best_idx].child_idx = new_idx as i32;
            new_idx
        } else {
            chosen.child_idx as usize
        };

        // Recurse (negate: opponent's value)
        let value = -self.simulate(child_node_idx, model);

        // Backup
        self.nodes[node_idx].visits += 1;
        self.nodes[node_idx].value_sum += value;

        value
    }

    /// Create a child node by applying a move.
    fn create_child(&mut self, parent_idx: usize, mv: &ScoredMove) -> usize {
        let parent = &self.nodes[parent_idx];

        // Apply move: place tiles, remove from rack
        let mut new_board = parent.board.clone();
        new_board.extend_from_slice(&mv.tiles);

        let mut new_rack = parent.rack.clone();
        for tile in &mv.tiles {
            if let Some(pos) = new_rack.iter().position(|&f| f == tile.face) {
                new_rack.remove(pos);
            }
        }

        let child = MCTSNode {
            board: new_board,
            rack: new_rack,
            bag_remaining: parent.bag_remaining.saturating_sub(mv.tiles.len()),
            player_score: parent.opponent_score, // turn flips
            opponent_score: parent.player_score + mv.score,
            is_my_turn: !parent.is_my_turn,
            visits: 0,
            value_sum: 0.0,
            prior: 0.0, // will be set during expand
            children: Vec::new(),
            expanded: false,
        };

        self.nodes.push(child);
        self.nodes.len() - 1
    }

    /// Expand a node: enumerate legal moves, run NN to get policy + value.
    fn expand_and_evaluate(&mut self, node_idx: usize, model: &QwirkleNet) -> f32 {
        let _guard = tch::no_grad_guard();

        let board = self.nodes[node_idx].board.clone();
        let rack: Vec<RackTile> = self.nodes[node_idx]
            .rack
            .iter()
            .enumerate()
            .map(|(i, &face)| RackTile { face, rack_position: i as u8 })
            .collect();

        // Get legal moves
        let moves = best_moves(&board, &rack);

        // NN forward pass for value + policy
        let nodes = extract_nodes(&board, &[]);
        let (feat, mask) = nodes_to_tensor(&nodes, &board);
        let ctx = GameContext {
            bag_remaining: self.nodes[node_idx].bag_remaining as f32,
            player_score: self.nodes[node_idx].player_score as f32,
            opponent_score: self.nodes[node_idx].opponent_score as f32,
            rack_size: self.nodes[node_idx].rack.len() as f32,
            bag_distribution: compute_bag_distribution(&board, &self.nodes[node_idx].rack),
        };

        let feat_b = feat.unsqueeze(0).to(self.device);
        let mask_b = mask.unsqueeze(0).to(self.device);
        let ctx_b = ctx.to_tensor().unsqueeze(0).to(self.device);

        let (value, policy_logits) = model.forward(&feat_b, &mask_b, &ctx_b, false);
        let value_f = f64::try_from(&value.squeeze_dim(0).squeeze_dim(0)).unwrap_or(0.0) as f32;

        // Extract priors per move
        let policy_flat = policy_logits.view([MAX_NODES * NUM_TILE_FACES]);
        let policy_probs = policy_flat.softmax(-1, Kind::Float);

        let priors: Vec<f32> = moves
            .iter()
            .map(|m| {
                if let Some(first_tile) = m.tiles.first() {
                    // Find node index for this coord
                    for (ni, n) in nodes.iter().enumerate() {
                        if n.coordinate == first_tile.coordinate && n.is_candidate {
                            let fi = tile_face_index(&first_tile.face);
                            let idx = (ni * NUM_TILE_FACES as usize + fi) as i64;
                            return f64::try_from(&policy_probs.get(idx)).unwrap_or(0.0) as f32;
                        }
                    }
                }
                1.0 / moves.len() as f32
            })
            .collect();

        // Normalize priors
        let prior_sum: f32 = priors.iter().sum();
        let priors: Vec<f32> = if prior_sum > 1e-6 {
            priors.iter().map(|p| p / prior_sum).collect()
        } else {
            vec![1.0 / moves.len() as f32; moves.len()]
        };

        let children: Vec<MCTSChild> = moves
            .into_iter()
            .zip(priors)
            .map(|(m, p)| MCTSChild { mv: m, prior: p, child_idx: -1 })
            .collect();

        self.nodes[node_idx].children = children;
        self.nodes[node_idx].expanded = true;

        value_f
    }

    /// Get best move from root based on visit counts.
    pub fn best_move(&self) -> Option<ScoredMove> {
        let root = &self.nodes[0];
        if root.children.is_empty() {
            return None;
        }

        let mut best_idx = 0;
        let mut best_visits = 0u32;

        for (i, child) in root.children.iter().enumerate() {
            let visits = if child.child_idx >= 0 {
                self.nodes[child.child_idx as usize].visits
            } else {
                0
            };
            if visits > best_visits {
                best_visits = visits;
                best_idx = i;
            }
        }

        Some(root.children[best_idx].mv.clone())
    }

    /// Get visit-count distribution over root's children (for training policy targets).
    pub fn visit_distribution(&self) -> Vec<(ScoredMove, f32)> {
        let root = &self.nodes[0];
        let total: u32 = root
            .children
            .iter()
            .map(|c| {
                if c.child_idx >= 0 {
                    self.nodes[c.child_idx as usize].visits
                } else {
                    0
                }
            })
            .sum();

        if total == 0 {
            return root
                .children
                .iter()
                .map(|c| (c.mv.clone(), 1.0 / root.children.len() as f32))
                .collect();
        }

        root.children
            .iter()
            .map(|c| {
                let v = if c.child_idx >= 0 {
                    self.nodes[c.child_idx as usize].visits
                } else {
                    0
                };
                (c.mv.clone(), v as f32 / total as f32)
            })
            .collect()
    }
}
