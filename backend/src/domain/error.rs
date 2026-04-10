//! Domain and application error types.

use super::tile::TileFace;

/// Game rule validation errors.
#[derive(Debug, thiserror::Error)]
pub enum GameError {
    #[error("not this player's turn")]
    NotPlayerTurn,

    #[error("player does not have tile {0:?}")]
    PlayerDoesntHaveTile(TileFace),

    #[error("tile placement is isolated from existing tiles")]
    TileIsolated,

    #[error("tiles do not form a valid row")]
    InvalidRow,

    #[error("position ({x}, {y}) is not free")]
    PositionNotFree { x: i32, y: i32 },

    #[error("not the highest-scoring move")]
    NotBestMove,
}

/// Application-level errors.
#[derive(Debug, thiserror::Error)]
pub enum AppError {
    #[error("game error: {0}")]
    Game(#[from] GameError),

    #[error("authentication failed: {0}")]
    Auth(String),

    #[error("not found: {0}")]
    NotFound(String),

    #[error("database error: {0}")]
    Db(#[from] sqlx::Error),

    #[error("internal error: {0}")]
    Internal(String),
}
