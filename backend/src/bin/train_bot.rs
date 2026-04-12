//! Training loop for Qwirkle dual-head neural network (value + policy).
//!
//! Loss = MSE(value) + α * CrossEntropy(policy)
//!
//! Usage: cargo run --features neural --bin train_bot -- \
//!          --data data/selfplay.bin --epochs 100 --lr 0.001 --batch 64 --out models/qwirkle_v1.pt

use std::fs;
use std::path::Path;

use rand::seq::SliceRandom;
use rand::thread_rng;
use tch::{nn, nn::OptimizerConfig, Device, Kind, Tensor};

use qwirkle_backend::neural::graph_transformer::{
    QwirkleNet, INPUT_DIM, MAX_NODES, CONTEXT_DIM, NUM_TILE_FACES,
};
use qwirkle_backend::neural::model_io::{load_model, save_model};

const FEAT_SIZE: usize = (MAX_NODES * INPUT_DIM) as usize;
const MASK_SIZE: usize = MAX_NODES as usize;
const AMASK_BITS: usize = (MAX_NODES * NUM_TILE_FACES) as usize;
const AMASK_BYTES: usize = (AMASK_BITS + 7) / 8;

struct Sample {
    features: Vec<f32>,
    mask: Vec<u8>,
    context: [f32; 76],
    action_mask_bits: Vec<u8>,
    action_index: u32,
    value: f32,
}

fn main() {
    let args: Vec<String> = std::env::args().collect();
    let data_path = parse_arg_str(&args, "--data").unwrap_or_else(|| "data/selfplay.bin".to_string());
    let epochs = parse_arg(&args, "--epochs").unwrap_or(100);
    let batch_size = parse_arg(&args, "--batch").unwrap_or(64);
    let lr: f64 = parse_arg_f64(&args, "--lr").unwrap_or(1e-3);
    let out_path = parse_arg_str(&args, "--out").unwrap_or_else(|| "models/qwirkle_v1.pt".to_string());
    let val_split: f64 = parse_arg_f64(&args, "--val-split").unwrap_or(0.1);
    let patience = parse_arg(&args, "--patience").unwrap_or(15);
    let weight_decay: f64 = parse_arg_f64(&args, "--weight-decay").unwrap_or(1e-4);
    let policy_weight: f64 = parse_arg_f64(&args, "--policy-weight").unwrap_or(1.0);
    let max_samples = parse_arg(&args, "--max-samples");
    let use_large = args.iter().any(|a| a == "--large");

    println!("Training config:");
    println!("  data:           {data_path}");
    println!("  epochs:         {epochs}");
    println!("  batch_size:     {batch_size}");
    println!("  lr:             {lr}");
    println!("  weight_decay:   {weight_decay}");
    println!("  policy_weight:  {policy_weight}");
    println!("  val_split:      {val_split}");
    println!("  patience:       {patience}");
    println!("  output:         {out_path}");
    if let Some(ms) = max_samples {
        println!("  max_samples:    {ms}");
    }

    let mut samples = load_samples(&data_path).expect("Failed to load training data");
    println!("Loaded {} samples", samples.len());

    if samples.is_empty() {
        eprintln!("No samples. Run selfplay first.");
        return;
    }

    let mut rng = thread_rng();

    // Subsample if requested (shuffle first for randomness)
    if let Some(ms) = max_samples {
        if ms < samples.len() {
            samples.shuffle(&mut rng);
            samples.truncate(ms);
            println!("Subsampled to {} samples", samples.len());
        }
    }

    let mut indices: Vec<usize> = (0..samples.len()).collect();
    indices.shuffle(&mut rng);

    let val_count = (samples.len() as f64 * val_split) as usize;
    let val_indices = indices[..val_count].to_vec();
    let train_indices = indices[val_count..].to_vec();

    println!("Train: {}, Val: {}", train_indices.len(), val_indices.len());

    let device = Device::cuda_if_available();
    println!("Device: {:?}", device);

    let vs = nn::VarStore::new(device);
    let cfg = if use_large {
        println!("  arch:           LARGE (6 layers, d=128)");
        qwirkle_backend::neural::graph_transformer::NetConfig::LARGE
    } else {
        println!("  arch:           TEACHER (4 layers, d=64)");
        qwirkle_backend::neural::graph_transformer::NetConfig::TEACHER
    };
    let model = QwirkleNet::new_with_config(&vs, cfg);

    let mut opt = nn::Adam {
        wd: weight_decay,
        ..nn::Adam::default()
    }
    .build(&vs, lr)
    .expect("Failed to create optimizer");

    let mut best_val_loss = f64::MAX;
    let mut epochs_no_improve = 0;

    for epoch in 0..epochs {
        // Cosine LR decay: lr * 0.5 * (1 + cos(pi * epoch / epochs))
        // Decays smoothly from `lr` to 0 over the course of training.
        let progress = epoch as f64 / epochs.max(1) as f64;
        let cos_factor = 0.5 * (1.0 + (std::f64::consts::PI * progress).cos());
        let cur_lr = lr * cos_factor.max(0.05); // floor at 5% to keep learning
        opt.set_lr(cur_lr);

        let (tv, tp, tt) = train_epoch(
            &model, &samples, &train_indices, batch_size, policy_weight, &mut opt, &mut rng, device,
        );

        let (vv, vp, vt) = if val_count > 0 {
            eval_epoch(&model, &samples, &val_indices, batch_size, policy_weight, device)
        } else {
            (tv, tp, tt)
        };

        println!(
            "Epoch {}/{}: train[v={:.4} p={:.4} t={:.4}] val[v={:.4} p={:.4} t={:.4}] lr={:.5}",
            epoch + 1, epochs, tv, tp, tt, vv, vp, vt, cur_lr,
        );

        if vt < best_val_loss {
            best_val_loss = vt;
            epochs_no_improve = 0;

            if let Some(parent) = Path::new(&out_path).parent() {
                fs::create_dir_all(parent).ok();
            }
            save_model(&vs, &out_path).expect("Failed to save model");
            println!("  -> Saved best (val={:.4})", vt);
        } else {
            epochs_no_improve += 1;
            if epochs_no_improve >= patience {
                println!("Early stopping after {patience} epochs without improvement");
                break;
            }
        }
    }

    println!("Done. Best val_loss={:.4}, model at {out_path}", best_val_loss);
}

fn train_epoch(
    model: &QwirkleNet,
    samples: &[Sample],
    indices: &[usize],
    batch_size: usize,
    policy_weight: f64,
    opt: &mut nn::Optimizer,
    rng: &mut impl rand::Rng,
    device: Device,
) -> (f64, f64, f64) {
    let mut shuffled = indices.to_vec();
    shuffled.shuffle(rng);

    let (mut tv, mut tp, mut n) = (0.0, 0.0, 0usize);

    for chunk in shuffled.chunks(batch_size) {
        let b = build_batch(samples, chunk, device);

        let (value_pred, policy_logits) = model.forward(&b.features, &b.mask, &b.context, true);

        let value_loss = value_pred.squeeze_dim(-1).mse_loss(&b.value_target, tch::Reduction::Mean);

        let policy_loss_opt = compute_policy_loss(&policy_logits, &b.action_mask, &b.action_target);

        let (loss, ploss_val) = match policy_loss_opt {
            Some(pl) => {
                let pv = f64::try_from(&pl).unwrap_or(0.0);
                let total = &value_loss + pl * policy_weight;
                (total, pv)
            }
            None => (value_loss.shallow_clone(), 0.0),
        };

        opt.backward_step(&loss);

        tv += f64::try_from(&value_loss).unwrap_or(0.0);
        tp += ploss_val;
        n += 1;
    }

    let d = n.max(1) as f64;
    (tv / d, tp / d, (tv + tp * policy_weight) / d)
}

fn eval_epoch(
    model: &QwirkleNet,
    samples: &[Sample],
    indices: &[usize],
    batch_size: usize,
    policy_weight: f64,
    device: Device,
) -> (f64, f64, f64) {
    let _guard = tch::no_grad_guard();
    let (mut tv, mut tp, mut n) = (0.0, 0.0, 0usize);

    for chunk in indices.chunks(batch_size) {
        let b = build_batch(samples, chunk, device);

        let (value_pred, policy_logits) = model.forward(&b.features, &b.mask, &b.context, false);

        let value_loss = value_pred.squeeze_dim(-1).mse_loss(&b.value_target, tch::Reduction::Mean);
        let ploss_val = match compute_policy_loss(&policy_logits, &b.action_mask, &b.action_target) {
            Some(pl) => f64::try_from(&pl).unwrap_or(0.0),
            None => 0.0,
        };

        tv += f64::try_from(&value_loss).unwrap_or(0.0);
        tp += ploss_val;
        n += 1;
    }

    let d = n.max(1) as f64;
    (tv / d, tp / d, (tv + tp * policy_weight) / d)
}

/// Cross-entropy loss for policy head.
/// Pre-filters samples to only those with valid target AND valid action mask.
/// This avoids NaN propagation through gradient.
fn compute_policy_loss(
    policy_logits: &Tensor,
    action_mask: &Tensor,
    action_target: &Tensor, // [batch] i64, -1 = skip
) -> Option<Tensor> {
    let bs = policy_logits.size()[0];
    let flat_size = MAX_NODES * NUM_TILE_FACES;

    // 1. Build a "keep" mask: target >= 0 AND action_mask has at least one true
    let target_valid = action_target.ge(0); // [batch]
    let has_action = action_mask
        .to_kind(Kind::Int64)
        .sum_dim_intlist(vec![1i64, 2], false, Kind::Int64)
        .gt(0); // [batch]
    let keep = Tensor::logical_and(&target_valid, &has_action); // [batch]

    let n_keep_t = keep.to_kind(Kind::Int64).sum(Kind::Int64);
    let n_keep = i64::try_from(&n_keep_t).unwrap_or(0);

    if n_keep == 0 {
        return None;
    }

    // 2. Index-select only the kept samples
    let keep_idx = keep.nonzero().squeeze_dim(-1); // [n_keep]
    let logits_kept = policy_logits.index_select(0, &keep_idx); // [n_keep, N, 36]
    let mask_kept = action_mask.index_select(0, &keep_idx); // [n_keep, N, 36]
    let target_kept = action_target.index_select(0, &keep_idx); // [n_keep]

    // 3. Apply mask and log_softmax (now safe — every row has at least one valid action)
    let masked = logits_kept.masked_fill(&mask_kept.logical_not(), -1e9);
    let flat = masked.view([n_keep, flat_size]);
    let log_probs = flat.log_softmax(-1, Kind::Float);

    // 4. Gather log-prob at target index
    let target_2d = target_kept.unsqueeze(-1); // [n_keep, 1]
    let gathered = log_probs.gather(1, &target_2d, false).squeeze_dim(-1); // [n_keep]

    Some(-gathered.mean(Kind::Float))
}

struct TrainBatch {
    features: Tensor,
    mask: Tensor,
    context: Tensor,
    action_mask: Tensor,
    action_target: Tensor, // [batch] i64 index, -1 for pass
    value_target: Tensor,
}

fn build_batch(samples: &[Sample], indices: &[usize], device: Device) -> TrainBatch {
    let bs = indices.len() as i64;

    let mut all_feat: Vec<f32> = Vec::with_capacity(indices.len() * FEAT_SIZE);
    let mut all_mask: Vec<f32> = Vec::with_capacity(indices.len() * MASK_SIZE);
    let mut all_ctx: Vec<f32> = Vec::with_capacity(indices.len() * 4);
    let mut all_amask: Vec<f32> = Vec::with_capacity(indices.len() * AMASK_BITS);
    let mut all_target: Vec<i64> = Vec::with_capacity(indices.len());
    let mut all_value: Vec<f32> = Vec::with_capacity(indices.len());

    for &idx in indices {
        let s = &samples[idx];
        all_feat.extend_from_slice(&s.features);

        for &b in &s.mask {
            all_mask.push(b as f32);
        }

        all_ctx.extend_from_slice(&s.context);

        // Unpack action mask bits
        for bit_idx in 0..AMASK_BITS {
            let byte = s.action_mask_bits[bit_idx / 8];
            let is_set = (byte >> (bit_idx % 8)) & 1;
            all_amask.push(is_set as f32);
        }

        // Action target: u32::MAX → -1 (pass)
        if s.action_index == u32::MAX {
            all_target.push(-1);
        } else {
            all_target.push(s.action_index as i64);
        }

        all_value.push(s.value);
    }

    TrainBatch {
        features: Tensor::from_slice(&all_feat)
            .view([bs, MAX_NODES, INPUT_DIM]).to(device),
        mask: Tensor::from_slice(&all_mask)
            .view([bs, MAX_NODES]).to_kind(Kind::Bool).to(device),
        context: Tensor::from_slice(&all_ctx)
            .view([bs, CONTEXT_DIM]).to(device),
        action_mask: Tensor::from_slice(&all_amask)
            .view([bs, MAX_NODES, NUM_TILE_FACES]).to_kind(Kind::Bool).to(device),
        action_target: Tensor::from_slice(&all_target).to(device),
        value_target: Tensor::from_slice(&all_value).to(device),
    }
}

// ── Load v3 format ──

fn load_samples(path: &str) -> std::io::Result<Vec<Sample>> {
    let data = fs::read(path)?;
    let mut c = 0usize;

    let version = r_u32(&data, &mut c);
    assert!(version == 5, "Expected format v5, got v{version}. Regenerate selfplay data.");

    let num = r_u64(&data, &mut c) as usize;
    let mut samples = Vec::with_capacity(num);

    for _ in 0..num {
        let mut features = Vec::with_capacity(FEAT_SIZE);
        for _ in 0..FEAT_SIZE { features.push(r_f32(&data, &mut c)); }

        let mask = data[c..c + MASK_SIZE].to_vec();
        c += MASK_SIZE;

        let mut context = [0.0f32; 76];
        for i in 0..76 {
            context[i] = r_f32(&data, &mut c);
        }

        let action_mask_bits = data[c..c + AMASK_BYTES].to_vec();
        c += AMASK_BYTES;

        let action_index = r_u32(&data, &mut c);
        let value = r_f32(&data, &mut c);

        samples.push(Sample { features, mask, context, action_mask_bits, action_index, value });
    }

    Ok(samples)
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
