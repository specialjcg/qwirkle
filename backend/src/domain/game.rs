//! Game state types.

use serde::{Deserialize, Serialize};

use super::player::Player;
use super::tile::{BoardTile, TileFace};

/// Strongly-typed game ID.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize, sqlx::Type)]
#[sqlx(transparent)]
pub struct GameId(pub i64);

/// Current status of a game.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum GameStatus {
    Waiting,
    InProgress,
    Finished,
}

/// Full game state returned to clients.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct GameState {
    pub id: GameId,
    pub board: Vec<BoardTile>,
    pub players: Vec<Player>,
    pub bag_count: usize,
    pub status: GameStatus,
}

/// Internal game state including the actual bag contents.
#[derive(Debug, Clone)]
pub struct GameInternal {
    pub id: GameId,
    pub board: Vec<BoardTile>,
    pub players: Vec<Player>,
    pub bag: Vec<TileFace>,
    pub status: GameStatus,
}

impl GameInternal {
    /// Convert to client-visible state (hides bag contents).
    pub fn to_client_state(&self) -> GameState {
        GameState {
            id: self.id,
            board: self.board.clone(),
            players: self.players.clone(),
            bag_count: self.bag.len(),
            status: self.status,
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::domain::color::Color;
    use crate::domain::player::{PlayerId, UserId};
    use crate::domain::shape::Shape;
    use crate::domain::tile::{Coordinate, RackTile, TileFace};

    #[test]
    fn to_client_state_hides_bag() {
        let game = GameInternal {
            id: GameId(1),
            board: vec![BoardTile {
                face: TileFace {
                    color: Color::Red,
                    shape: Shape::Circle,
                },
                coordinate: Coordinate { x: 0, y: 0 },
            }],
            players: vec![Player {
                id: PlayerId(1),
                pseudo: "Alice".to_string(),
                user_id: UserId(1),
                game_id: GameId(1),
                game_position: 0,
                points: 5,
                last_turn_points: 5,
                rack: vec![],
                is_turn: true,
            }],
            bag: vec![
                TileFace { color: Color::Blue, shape: Shape::Square },
                TileFace { color: Color::Green, shape: Shape::Diamond },
            ],
            status: GameStatus::InProgress,
        };

        let client = game.to_client_state();
        assert_eq!(client.id, GameId(1));
        assert_eq!(client.board.len(), 1);
        assert_eq!(client.players.len(), 1);
        assert_eq!(client.bag_count, 2); // Only count, not contents
        assert_eq!(client.status, GameStatus::InProgress);
    }

    #[test]
    fn empty_game_to_client_state() {
        let game = GameInternal {
            id: GameId(99),
            board: vec![],
            players: vec![],
            bag: vec![],
            status: GameStatus::Finished,
        };
        let client = game.to_client_state();
        assert_eq!(client.bag_count, 0);
        assert_eq!(client.status, GameStatus::Finished);
    }

    #[test]
    fn game_status_serialization() {
        let json = serde_json::to_string(&GameStatus::InProgress).unwrap();
        assert_eq!(json, "\"in_progress\"");
        let parsed: GameStatus = serde_json::from_str(&json).unwrap();
        assert_eq!(parsed, GameStatus::InProgress);
    }
}
