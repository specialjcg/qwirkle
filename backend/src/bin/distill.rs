//! Knowledge distillation: train a small student model from a large teacher.
//!
//! Loss = α * KL(student || teacher) + (1-α) * MSE(value)
//!
//! Usage: cargo run --features neural --release --bin distill -- \
//!          --teacher models/teacher.pt --data data/bootstrap.bin \
//!          --epochs 50 --out models/student.pt

use std::fs;
use std::path::Path;

use rand::seq::SliceRandom;
use rand::thread_rng;
use tch::{nn, nn::OptimizerConfig, Device, Kind, Tensor};

use qwirkle_backend::neural::graph_transformer::{
    NetConfig, QwirkleNet, CONTEXT_DIM, INPUT_DIM, MAX_NODES, NUM_TILE_FACES,
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
    let teacher_path = parse_arg_str(&args, "--teacher").expect("--teacher required");
    let data_path = parse_arg_str(&args, "--data").expect("--data required");
    let out_path = parse_arg_str(&args, "--out").unwrap_or_else(|| "models/student.pt".to_string());
    let epochs = parse_arg(&args, "--epochs").unwrap_or(50);
    let batch_size = parse_arg(&args, "--batch").unwrap_or(128);
    let lr: f64 = parse_arg_f64(&args, "--lr").unwrap_or(1e-3);
    let alpha: f64 = parse_arg_f64(&args, "--alpha").unwrap_or(0.7);
    let temperature: f64 = parse_arg_f64(&args, "--temperature").unwrap_or(4.0);
    let max_samples = parse_arg(&args, "--max-samples");

    println!("Distillation:");
    println!("  teacher:     {teacher_path}");
    println!("  data:        {data_path}");
    println!("  epochs:      {epochs}");
    println!("  batch:       {batch_size}");
    println!("  lr:          {lr}");
    println!("  alpha:       {alpha}");
    println!("  temperature: {temperature}");
    println!("  out:         {out_path}");

    let device = Device::cuda_if_available();
    println!("  device:      {:?}\n", device);

    let large_teacher = args.iter().any(|a| a == "--large-teacher");

    // Load teacher (frozen)
    let teacher_cfg = if large_teacher { NetConfig::LARGE } else { NetConfig::TEACHER };
    let mut teacher_vs = nn::VarStore::new(device);
    let teacher = QwirkleNet::new_with_config(&teacher_vs, teacher_cfg);
    load_model(&mut teacher_vs, &teacher_path).expect("load teacher");
    teacher_vs.freeze();
    println!("Teacher loaded ({} params)", teacher_param_count(&teacher_vs));

    // Build student
    let student_vs = nn::VarStore::new(device);
    let student = QwirkleNet::new_with_config(&student_vs, NetConfig::STUDENT);
    println!("Student created ({} params)\n", teacher_param_count(&student_vs));

    // Load data
    let mut samples = load_samples(&data_path).expect("load data");
    println!("Loaded {} samples", samples.len());

    let mut rng = thread_rng();
    if let Some(ms) = max_samples {
        if ms < samples.len() {
            samples.shuffle(&mut rng);
            samples.truncate(ms);
            println!("Subsampled to {} samples", samples.len());
        }
    }

    let mut indices: Vec<usize> = (0..samples.len()).collect();
    indices.shuffle(&mut rng);
    let n_val = samples.len() / 10;
    let val_indices = indices[..n_val].to_vec();
    let train_indices = indices[n_val..].to_vec();

    let mut opt = nn::Adam {
        wd: 1e-4,
        ..nn::Adam::default()
    }
    .build(&student_vs, lr)
    .expect("optimizer");

    let mut best_val = f64::MAX;

    for epoch in 0..epochs {
        // Train
        let mut shuffled = train_indices.clone();
        shuffled.shuffle(&mut rng);

        let mut total_loss = 0.0;
        let mut total_v = 0.0;
        let mut total_kl = 0.0;
        let mut n = 0;

        for chunk in shuffled.chunks(batch_size) {
            let b = build_batch(&samples, chunk, device);

            // Teacher forward (frozen, no grad)
            let (t_v, t_p) = {
                let _g = tch::no_grad_guard();
                teacher.forward(&b.features, &b.mask, &b.context, false)
            };

            // Student forward
            let (s_v, s_p) = student.forward(&b.features, &b.mask, &b.context, true);

            // Value loss: MSE(student, value_target) — combine with teacher signal
            let v_loss = s_v.squeeze_dim(-1).mse_loss(&b.value_target, tch::Reduction::Mean);

            // Policy distillation: KL(student || teacher) with temperature
            let bs = s_p.size()[0];
            let s_flat = s_p.view([bs, -1]) / temperature;
            let t_flat = t_p.view([bs, -1]) / temperature;

            // Mask invalid actions to -inf in both
            let action_mask_flat = b.action_mask.view([bs, -1]);
            let s_masked = s_flat.masked_fill(&action_mask_flat.logical_not(), -1e9);
            let t_masked = t_flat.masked_fill(&action_mask_flat.logical_not(), -1e9);

            let s_log_probs = s_masked.log_softmax(-1, Kind::Float);
            let t_probs = t_masked.softmax(-1, Kind::Float);

            // KL = sum(t * (log(t) - log(s))). Use kl_div: input=log_softmax(s), target=t
            let kl = s_log_probs.kl_div(&t_probs, tch::Reduction::Mean, false)
                * (temperature * temperature);

            let loss = &v_loss * (1.0 - alpha) + &kl * alpha;

            opt.backward_step(&loss);

            total_loss += f64::try_from(&loss).unwrap_or(0.0);
            total_v += f64::try_from(&v_loss).unwrap_or(0.0);
            total_kl += f64::try_from(&kl).unwrap_or(0.0);
            n += 1;
        }

        let nf = n.max(1) as f64;
        let train_loss = total_loss / nf;
        let train_v = total_v / nf;
        let train_kl = total_kl / nf;

        // Validate
        let _g = tch::no_grad_guard();
        let mut val_loss = 0.0;
        let mut nv = 0;
        for chunk in val_indices.chunks(batch_size) {
            let b = build_batch(&samples, chunk, device);
            let (s_v, _) = student.forward(&b.features, &b.mask, &b.context, false);
            let v_loss = s_v.squeeze_dim(-1).mse_loss(&b.value_target, tch::Reduction::Mean);
            val_loss += f64::try_from(&v_loss).unwrap_or(0.0);
            nv += 1;
        }
        let vl = val_loss / nv.max(1) as f64;

        println!(
            "Epoch {}/{}: train[loss={:.4} v={:.4} kl={:.4}] val_v={:.4}",
            epoch + 1, epochs, train_loss, train_v, train_kl, vl
        );

        if vl < best_val {
            best_val = vl;
            if let Some(parent) = Path::new(&out_path).parent() {
                fs::create_dir_all(parent).ok();
            }
            save_model(&student_vs, &out_path).expect("save student");
            println!("  -> Saved best (val_v={:.4})", vl);
        }
    }

    println!("\nDistillation done. Best val_v={:.4}", best_val);
    println!("Student saved to {out_path}");
}

fn teacher_param_count(vs: &nn::VarStore) -> usize {
    vs.variables().values().map(|t| t.numel() as usize).sum()
}

struct TrainBatch {
    features: Tensor,
    mask: Tensor,
    context: Tensor,
    action_mask: Tensor,
    value_target: Tensor,
}

fn build_batch(samples: &[Sample], indices: &[usize], device: Device) -> TrainBatch {
    let bs = indices.len() as i64;
    let mut all_feat: Vec<f32> = Vec::with_capacity(indices.len() * FEAT_SIZE);
    let mut all_mask: Vec<f32> = Vec::with_capacity(indices.len() * MASK_SIZE);
    let mut all_ctx: Vec<f32> = Vec::with_capacity(indices.len() * 4);
    let mut all_amask: Vec<f32> = Vec::with_capacity(indices.len() * AMASK_BITS);
    let mut all_value: Vec<f32> = Vec::with_capacity(indices.len());

    for &idx in indices {
        let s = &samples[idx];
        all_feat.extend_from_slice(&s.features);
        for &b in &s.mask {
            all_mask.push(b as f32);
        }
        all_ctx.extend_from_slice(&s.context);
        for bit_idx in 0..AMASK_BITS {
            let byte = s.action_mask_bits[bit_idx / 8];
            let is_set = (byte >> (bit_idx % 8)) & 1;
            all_amask.push(is_set as f32);
        }
        all_value.push(s.value);
    }

    TrainBatch {
        features: Tensor::from_slice(&all_feat).view([bs, MAX_NODES, INPUT_DIM]).to(device),
        mask: Tensor::from_slice(&all_mask).view([bs, MAX_NODES]).to_kind(Kind::Bool).to(device),
        context: Tensor::from_slice(&all_ctx).view([bs, CONTEXT_DIM]).to(device),
        action_mask: Tensor::from_slice(&all_amask).view([bs, MAX_NODES, NUM_TILE_FACES]).to_kind(Kind::Bool).to(device),
        value_target: Tensor::from_slice(&all_value).to(device),
    }
}

// ── Load v3 binary format ──

fn load_samples(path: &str) -> std::io::Result<Vec<Sample>> {
    let data = fs::read(path)?;
    let mut c = 0usize;
    let version = r_u32(&data, &mut c);
    assert!(version == 5, "Expected v5 format, got v{version}");
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
