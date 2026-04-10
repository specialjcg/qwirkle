//! Graph Transformer Value+Policy Network for Qwirkle.
//!
//! Adapted from the Take it Easy Graph Transformer architecture.
//! Full self-attention over board nodes (occupied + candidate cells)
//! with attention masking for variable-size boards padded to MAX_NODES.
//!
//! Two heads:
//! - **Value head**: scalar evaluation of the board state (win probability)
//! - **Policy head**: per-node logits over 36 tile faces (which tile to place where)

#![cfg(feature = "neural")]

use tch::{nn, Device, Kind, Tensor};

pub const MAX_NODES: i64 = 128;
pub const INPUT_DIM: i64 = 22;
pub const D_MODEL: i64 = 64;
pub const N_HEADS: i64 = 4;
pub const N_LAYERS: usize = 4;
pub const D_FF: i64 = 256;
pub const DROPOUT: f64 = 0.1;
/// Context features: 4 base + 36 bag distribution + 36 rack distribution.
pub const CONTEXT_DIM: i64 = 4 + 36 + 36;
pub const NUM_TILE_FACES: i64 = 36; // 6 colors × 6 shapes

// ── Multi-Head Self-Attention ──

pub struct MultiHeadAttention {
    q_proj: nn::Linear,
    k_proj: nn::Linear,
    v_proj: nn::Linear,
    out_proj: nn::Linear,
    num_heads: i64,
    head_dim: i64,
    scale: f64,
}

impl MultiHeadAttention {
    pub fn new(path: &nn::Path, embed_dim: i64, num_heads: i64) -> Self {
        let head_dim = embed_dim / num_heads;
        Self {
            q_proj: nn::linear(path / "q_proj", embed_dim, embed_dim, Default::default()),
            k_proj: nn::linear(path / "k_proj", embed_dim, embed_dim, Default::default()),
            v_proj: nn::linear(path / "v_proj", embed_dim, embed_dim, Default::default()),
            out_proj: nn::linear(path / "out_proj", embed_dim, embed_dim, Default::default()),
            num_heads,
            head_dim,
            scale: 1.0 / (head_dim as f64).sqrt(),
        }
    }

    pub fn forward(&self, x: &Tensor, mask: Option<&Tensor>, train: bool, dropout: f64) -> Tensor {
        let (batch, seq, _) = x.size3().unwrap();

        let q = x.apply(&self.q_proj).view([batch, seq, self.num_heads, self.head_dim]).permute([0, 2, 1, 3]);
        let k = x.apply(&self.k_proj).view([batch, seq, self.num_heads, self.head_dim]).permute([0, 2, 1, 3]);
        let v = x.apply(&self.v_proj).view([batch, seq, self.num_heads, self.head_dim]).permute([0, 2, 1, 3]);

        let mut attn = q.matmul(&k.transpose(-2, -1)) * self.scale;

        if let Some(m) = mask {
            let mask_expanded = m.unsqueeze(1).unsqueeze(2);
            attn = attn.masked_fill(&mask_expanded.logical_not(), f64::NEG_INFINITY);
        }

        let attn_weights = attn.softmax(-1, Kind::Float);
        let attn_weights = if train {
            attn_weights.dropout(dropout, true)
        } else {
            attn_weights
        };

        let out = attn_weights.matmul(&v);
        let out = out.permute([0, 2, 1, 3]).contiguous().view([batch, seq, -1]);
        out.apply(&self.out_proj)
    }
}

// ── Feed-Forward Network ──

pub struct FeedForward {
    fc1: nn::Linear,
    fc2: nn::Linear,
}

impl FeedForward {
    pub fn new(path: &nn::Path, embed_dim: i64, ff_dim: i64) -> Self {
        Self {
            fc1: nn::linear(path / "fc1", embed_dim, ff_dim, Default::default()),
            fc2: nn::linear(path / "fc2", ff_dim, embed_dim, Default::default()),
        }
    }

    pub fn forward(&self, x: &Tensor, train: bool, dropout: f64) -> Tensor {
        let h = x.apply(&self.fc1).gelu("none");
        let h = if train { h.dropout(dropout, true) } else { h };
        h.apply(&self.fc2)
    }
}

// ── Transformer Layer (Pre-LN) ──

pub struct TransformerLayer {
    attn: MultiHeadAttention,
    ff: FeedForward,
    ln1: nn::LayerNorm,
    ln2: nn::LayerNorm,
}

impl TransformerLayer {
    pub fn new(path: &nn::Path, embed_dim: i64, num_heads: i64, ff_dim: i64) -> Self {
        let ln_config = nn::LayerNormConfig { eps: 1e-5, ..Default::default() };
        Self {
            attn: MultiHeadAttention::new(&(path / "attn"), embed_dim, num_heads),
            ff: FeedForward::new(&(path / "ff"), embed_dim, ff_dim),
            ln1: nn::layer_norm(path / "ln1", vec![embed_dim], ln_config),
            ln2: nn::layer_norm(path / "ln2", vec![embed_dim], ln_config),
        }
    }

    pub fn forward(&self, x: &Tensor, mask: Option<&Tensor>, train: bool, dropout: f64) -> Tensor {
        let x_norm = x.apply(&self.ln1);
        let attn_out = self.attn.forward(&x_norm, mask, train, dropout);
        let attn_out = if train { attn_out.dropout(dropout, true) } else { attn_out };
        let x = x + attn_out;

        let x_norm = x.apply(&self.ln2);
        let ff_out = self.ff.forward(&x_norm, train, dropout);
        let ff_out = if train { ff_out.dropout(dropout, true) } else { ff_out };
        &x + ff_out
    }
}

// ── Graph Transformer Backbone ──

pub struct GraphTransformer {
    input_proj: nn::Linear,
    layers: Vec<TransformerLayer>,
    final_ln: nn::LayerNorm,
    dropout: f64,
}

impl GraphTransformer {
    pub fn new(
        vs: &nn::VarStore,
        input_dim: i64,
        embed_dim: i64,
        num_layers: usize,
        num_heads: i64,
        ff_dim: i64,
        dropout: f64,
    ) -> Self {
        let root = vs.root();
        let input_proj = nn::linear(&root / "input_proj", input_dim, embed_dim, Default::default());

        let layers = (0..num_layers)
            .map(|i| {
                TransformerLayer::new(
                    &(&root / format!("layer_{i}")),
                    embed_dim,
                    num_heads,
                    ff_dim,
                )
            })
            .collect();

        let ln_config = nn::LayerNormConfig { eps: 1e-5, ..Default::default() };
        let final_ln = nn::layer_norm(&root / "final_ln", vec![embed_dim], ln_config);

        Self { input_proj, layers, final_ln, dropout }
    }

    /// Forward pass. Returns per-node embeddings [batch, max_nodes, D_MODEL].
    pub fn forward(&self, x: &Tensor, mask: Option<&Tensor>, train: bool) -> Tensor {
        let mut h = x.apply(&self.input_proj);
        if train {
            h = h.dropout(self.dropout, true);
        }

        for layer in &self.layers {
            h = layer.forward(&h, mask, train, self.dropout);
        }

        h.apply(&self.final_ln)
    }
}

// ── Qwirkle Dual-Head Network (Value + Policy) ──

pub struct QwirkleNet {
    transformer: GraphTransformer,
    // Value head
    context_proj: nn::Linear,
    value_fc1: nn::Linear,
    value_fc2: nn::Linear,
    // Policy head: per-node logits over 36 tile faces
    policy_fc1: nn::Linear,
    policy_fc2: nn::Linear,
}

/// Hyperparameter config for QwirkleNet (allows distillation to smaller variants).
#[derive(Clone, Copy)]
pub struct NetConfig {
    pub d_model: i64,
    pub n_heads: i64,
    pub n_layers: usize,
    pub d_ff: i64,
    pub dropout: f64,
}

impl NetConfig {
    pub const TEACHER: Self = Self {
        d_model: D_MODEL,
        n_heads: N_HEADS,
        n_layers: N_LAYERS,
        d_ff: D_FF,
        dropout: DROPOUT,
    };

    /// Small student for fast CPU inference (~10x fewer params).
    pub const STUDENT: Self = Self {
        d_model: 32,
        n_heads: 2,
        n_layers: 2,
        d_ff: 128,
        dropout: 0.05,
    };
}

impl QwirkleNet {
    pub fn new(vs: &nn::VarStore) -> Self {
        Self::new_with_config(vs, NetConfig::TEACHER)
    }

    pub fn new_with_config(vs: &nn::VarStore, cfg: NetConfig) -> Self {
        let root = vs.root();
        let transformer = GraphTransformer::new(
            vs, INPUT_DIM, cfg.d_model, cfg.n_layers, cfg.n_heads, cfg.d_ff, cfg.dropout,
        );

        // Value head
        let context_proj = nn::linear(
            &root / "context_proj",
            cfg.d_model + CONTEXT_DIM,
            cfg.d_model,
            Default::default(),
        );
        let value_fc1 = nn::linear(&root / "value_fc1", cfg.d_model, cfg.d_model, Default::default());
        let value_fc2 = nn::linear(&root / "value_fc2", cfg.d_model, 1, Default::default());

        // Policy head
        let policy_fc1 = nn::linear(&root / "policy_fc1", cfg.d_model, cfg.d_model, Default::default());
        let policy_fc2 = nn::linear(&root / "policy_fc2", cfg.d_model, NUM_TILE_FACES, Default::default());

        Self {
            transformer,
            context_proj,
            value_fc1,
            value_fc2,
            policy_fc1,
            policy_fc2,
        }
    }

    /// Full forward: returns (value, policy_logits).
    /// - value: [batch, 1] — win probability
    /// - policy_logits: [batch, max_nodes, 36] — raw logits per (node, tile_face)
    pub fn forward(
        &self,
        node_features: &Tensor,
        mask: &Tensor,
        context: &Tensor,
        train: bool,
    ) -> (Tensor, Tensor) {
        // Shared transformer backbone
        let h = self.transformer.forward(node_features, Some(mask), train);
        // h: [batch, max_nodes, D_MODEL]

        // ── Value head ──
        let mask_f = mask.unsqueeze(-1).to_kind(Kind::Float);
        let h_masked = &h * &mask_f;
        let sum = h_masked.sum_dim_intlist(1, false, Kind::Float);
        let count = mask_f.sum_dim_intlist(1, false, Kind::Float).clamp_min(1.0);
        let pooled = &sum / &count; // [batch, D_MODEL]

        let combined = Tensor::cat(&[pooled, context.shallow_clone()], 1);
        let projected = combined.apply(&self.context_proj).gelu("none");
        let v = projected.apply(&self.value_fc1).gelu("none");
        let value = v.apply(&self.value_fc2).tanh(); // [-1, 1]

        // ── Policy head ──
        let p = h.apply(&self.policy_fc1).gelu("none");
        let policy_logits = p.apply(&self.policy_fc2);
        // policy_logits: [batch, max_nodes, 36]

        (value, policy_logits)
    }

    /// Value-only forward (cheaper, for evaluation).
    pub fn forward_value(
        &self,
        node_features: &Tensor,
        mask: &Tensor,
        context: &Tensor,
        train: bool,
    ) -> Tensor {
        let (value, _) = self.forward(node_features, mask, context, train);
        value
    }

    /// Policy-only forward: returns masked log-probabilities over actions.
    /// action_mask: [batch, max_nodes, 36] bool — true for valid (candidate_pos, rack_tile) pairs
    pub fn forward_policy(
        &self,
        node_features: &Tensor,
        mask: &Tensor,
        context: &Tensor,
        action_mask: &Tensor,
        train: bool,
    ) -> Tensor {
        let (_, logits) = self.forward(node_features, mask, context, train);

        // Mask invalid actions with -inf before softmax
        let masked_logits = logits.masked_fill(&action_mask.logical_not(), f64::NEG_INFINITY);

        // Flatten to [batch, max_nodes * 36] for softmax over all actions
        let batch = masked_logits.size()[0];
        let flat = masked_logits.view([batch, -1]);
        let log_probs = flat.log_softmax(-1, Kind::Float);
        log_probs.view_as(&logits) // [batch, max_nodes, 36]
    }
}

// ── Backward-compatible alias ──

pub type QwirkleValueNet = QwirkleNet;
