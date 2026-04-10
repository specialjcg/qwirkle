//! Load and save model weights using named tensor pairs.

#![cfg(feature = "neural")]

use std::path::Path;
use tch::{nn, Tensor};

/// Save model weights as named tensor list.
pub fn save_model(vs: &nn::VarStore, path: &str) -> Result<(), Box<dyn std::error::Error>> {
    let vars = vs.variables();
    let named_tensors: Vec<(&str, &Tensor)> = vars
        .iter()
        .map(|(name, tensor)| (name.as_str(), tensor))
        .collect();
    Tensor::save_multi(&named_tensors, path)?;
    Ok(())
}

/// Load model weights from named tensor file.
pub fn load_model(vs: &mut nn::VarStore, path: &str) -> Result<(), Box<dyn std::error::Error>> {
    if !Path::new(path).exists() {
        return Err(format!("Model file not found: {path}").into());
    }

    let named_tensors = Tensor::load_multi(path)?;
    let mut var_map = vs.variables();

    for (name, tensor) in &named_tensors {
        if let Some(var) = var_map.get_mut(name) {
            tch::no_grad(|| {
                var.copy_(tensor);
            });
        }
    }

    Ok(())
}
