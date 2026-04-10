//! Player types and ID newtypes.

use serde::{Deserialize, Serialize};

use super::tile::RackTile;

/// Strongly-typed player ID.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize, sqlx::Type)]
#[sqlx(transparent)]
pub struct PlayerId(pub i64);

/// Strongly-typed user ID.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize, sqlx::Type)]
#[sqlx(transparent)]
pub struct UserId(pub i64);

/// A player in a game.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Player {
    pub id: PlayerId,
    pub pseudo: String,
    pub user_id: UserId,
    pub game_id: super::game::GameId,
    pub game_position: u8,
    pub points: i32,
    pub last_turn_points: i32,
    pub rack: Vec<RackTile>,
    pub is_turn: bool,
}
