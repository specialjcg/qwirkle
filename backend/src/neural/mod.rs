//! Neural network module for the Qwirkle bot.
//! Feature-gated behind `neural` to avoid requiring libtorch for basic builds.

#[cfg(feature = "neural")]
pub mod graph_transformer;
#[cfg(feature = "neural")]
pub mod model_io;
#[cfg(feature = "neural")]
pub mod tensor_conversion;
#[cfg(feature = "neural")]
pub mod mcts;
