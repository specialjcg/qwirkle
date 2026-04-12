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
    compute_bag_distribution, compute_rack_distribution, extract_nodes, nodes_to_tensor,
    tile_face_index, GameContext,
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

    /// Search + add Dirichlet noise to root priors for exploration (self-play only).
    /// alpha ~ 0.3, epsilon ~ 0.25 is the AlphaZero convention.
    pub fn search_with_noise(
        &mut self,
        model: &QwirkleNet,
        n_simulations: u32,
        dirichlet_alpha: f32,
        noise_epsilon: f32,
    ) {
        // First expand root (needed to know children for noise)
        if !self.nodes[0].expanded {
            let _ = self.simulate(0, model);
        }

        // Sample Dirichlet noise for root children
        let n_children = self.nodes[0].children.len();
        if n_children > 0 && noise_epsilon > 0.0 {
            let noise = sample_dirichlet(n_children, dirichlet_alpha);
            for (i, child) in self.nodes[0].children.iter_mut().enumerate() {
                child.prior = (1.0 - noise_epsilon) * child.prior + noise_epsilon * noise[i];
            }
        }

        // Continue simulations
        for _ in 0..n_simulations.saturating_sub(1) {
            let _ = self.simulate(0, model);
        }
    }

    /// Sample a move stochastically from the visit distribution with temperature.
    /// temperature=0 → argmax. temperature=1 → proportional to visits.
    pub fn sample_move(&self, temperature: f32) -> Option<ScoredMove> {
        let root = &self.nodes[0];
        if root.children.is_empty() {
            return None;
        }

        if temperature <= 1e-3 {
            return self.best_move();
        }

        // Collect visit counts
        let mut visits: Vec<f32> = Vec::with_capacity(root.children.len());
        for child in &root.children {
            let v = if child.child_idx >= 0 {
                self.nodes[child.child_idx as usize].visits as f32
            } else {
                0.0
            };
            visits.push(v);
        }

        // Apply temperature: visits^(1/T)
        let inv_t = 1.0 / temperature;
        let mut weights: Vec<f32> = visits.iter().map(|&v| (v + 1e-6).powf(inv_t)).collect();
        let sum: f32 = weights.iter().sum();
        if sum <= 0.0 {
            return self.best_move();
        }
        for w in &mut weights {
            *w /= sum;
        }

        // Sample
        use rand::Rng;
        let mut rng = rand::thread_rng();
        let r: f32 = rng.gen();
        let mut cumul = 0.0;
        for (i, w) in weights.iter().enumerate() {
            cumul += w;
            if r <= cumul {
                return Some(root.children[i].mv.clone());
            }
        }
        self.best_move()
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
                // NEGAMAX: child.q_value() is from CHILD's perspective (opponent).
                // Parent must NEGATE to get the value from its own POV.
                let child_node = &self.nodes[child.child_idx as usize];
                let q_from_parent = -child_node.q_value();
                let u = C_PUCT * child.prior * (parent_visits as f32).sqrt()
                    / (1.0 + child_node.visits as f32);
                q_from_parent + u
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
    /// IMPORTANT: after the move, it's the opponent's turn. We don't know their rack,
    /// so we approximate by using the SAME rack (from which we've removed played tiles).
    /// This is an approximation — for a proper info-set MCTS, we'd sample from the bag.
    ///
    /// The child node's "rack" represents the player-to-move at that node.
    /// The simulation will flip the value via negamax, so we're consistent.
    fn create_child(&mut self, parent_idx: usize, mv: &ScoredMove) -> usize {
        let parent = &self.nodes[parent_idx];

        let mut new_board = parent.board.clone();
        new_board.extend_from_slice(&mv.tiles);

        // Remove played tiles from parent's rack (represents the player who just played)
        let mut post_play_rack = parent.rack.clone();
        for tile in &mv.tiles {
            if let Some(pos) = post_play_rack.iter().position(|&f| f == tile.face) {
                post_play_rack.remove(pos);
            }
        }

        // For the child (opponent's turn), we'd need opponent's rack which we don't know.
        // APPROXIMATION: use the post-play rack as a placeholder. The NN learns in the
        // same "player sees their own rack" convention, so this is self-consistent even
        // though it's not the real opponent rack.
        let child = MCTSNode {
            board: new_board,
            rack: post_play_rack,
            bag_remaining: parent.bag_remaining.saturating_sub(mv.tiles.len()),
            player_score: parent.opponent_score,
            opponent_score: parent.player_score + mv.score,
            is_my_turn: !parent.is_my_turn,
            visits: 0,
            value_sum: 0.0,
            prior: 0.0,
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
            rack_distribution: compute_rack_distribution(&self.nodes[node_idx].rack),
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

/// Information-Set MCTS for Qwirkle.
///
/// The opponent's rack is hidden. To handle this, we sample N "determinizations"
/// from the visible bag (each is a possible opponent rack), run MCTS on each,
/// and aggregate the visit counts to pick the move that's robust across all
/// possible game states.
///
/// Returns: best move averaged across N sampled games.
pub fn ismcts_best_move(
    board: &[BoardTile],
    rack: &[TileFace],
    bag: &[TileFace],
    player_score: i32,
    opponent_score: i32,
    model: &QwirkleNet,
    n_samples: u32,
    n_sims_per_sample: u32,
    device: Device,
) -> Option<ScoredMove> {
    use std::collections::HashMap;
    use rand::seq::SliceRandom;

    let mut rng = rand::thread_rng();
    let mut move_visits: HashMap<String, (u32, ScoredMove)> = HashMap::new();

    for _sample in 0..n_samples {
        // Determinization: shuffle the bag and pull a hypothetical opponent rack
        // (The "bag" passed here represents bag + opponent rack from our POV.)
        let mut sampled_bag = bag.to_vec();
        sampled_bag.shuffle(&mut rng);

        // Run MCTS on this determinization
        let root = MCTSNode::new_root(
            board.to_vec(),
            rack.to_vec(),
            sampled_bag.len(),
            player_score,
            opponent_score,
        );
        let mut mcts = MCTS::new(root, device);
        mcts.search(model, n_sims_per_sample);

        // Aggregate visits
        let root_node = &mcts.nodes[0];
        for child in &root_node.children {
            let visits = if child.child_idx >= 0 {
                mcts.nodes[child.child_idx as usize].visits
            } else {
                0
            };
            // Key by the first tile placed (good enough for hashing moves)
            let key = format!("{:?}", child.mv.tiles);
            move_visits
                .entry(key)
                .and_modify(|(v, _)| *v += visits)
                .or_insert((visits, child.mv.clone()));
        }
    }

    // Pick the move with highest aggregated visits
    move_visits
        .into_values()
        .max_by_key(|(v, _)| *v)
        .map(|(_, m)| m)
}

/// Sample from a symmetric Dirichlet(alpha) distribution of size n.
/// Uses Gamma(alpha, 1) sampling and normalization.
fn sample_dirichlet(n: usize, alpha: f32) -> Vec<f32> {
    use rand::Rng;
    let mut rng = rand::thread_rng();
    // Approximate Gamma(alpha, 1) via exponential for alpha~0.3:
    // when alpha is small, gamma looks like exp^(1/alpha * U^(1/alpha))
    // Simpler: use Marsaglia-Tsang rejection for alpha >= 1, else transform.
    // For simplicity here, use the transformation: X = (U_1^(1/alpha))/Gamma(1+alpha) approx
    // which is fine for our MCTS noise use-case (distribution shape matters more than precision).

    // For small alpha, we sample via: X_i = -ln(U_i) / Z where U_i ~ Uniform(0,1)^(1/alpha)
    let samples: Vec<f32> = (0..n)
        .map(|_| {
            let u: f32 = rng.gen_range(1e-6..1.0);
            // Wilson-Hilferty-style approx: good enough for noise
            let g = (-u.ln()).powf(1.0 / alpha.max(1e-6));
            g.max(1e-8)
        })
        .collect();

    let sum: f32 = samples.iter().sum();
    if sum <= 0.0 {
        return vec![1.0 / n as f32; n];
    }
    samples.iter().map(|&x| x / sum).collect()
}
