//! SSE event types broadcast to game participants.

use serde::Serialize;

use crate::domain::game::GameId;
use crate::domain::player::PlayerId;
use crate::domain::tile::BoardTile;

/// Events sent via Server-Sent Events to game subscribers.
#[derive(Debug, Clone, Serialize)]
#[serde(tag = "type", content = "data")]
#[serde(rename_all = "snake_case")]
pub enum SseEvent {
    TilesPlayed {
        player_id: PlayerId,
        points: i32,
        tiles: Vec<BoardTile>,
    },
    TilesSwapped {
        player_id: PlayerId,
    },
    TurnChanged {
        player_id: PlayerId,
        pseudo: String,
    },
    GameOver {
        winner_ids: Vec<PlayerId>,
    },
    PlayerJoined {
        player_id: PlayerId,
        pseudo: String,
    },
    InstantGameStarted {
        game_id: GameId,
    },
    InstantGamePlayerWaiting {
        pseudo: String,
    },
}
