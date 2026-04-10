//! Instant game matchmaking handler.

use axum::extract::{Path, State};
use axum::Json;
use serde::Serialize;
use std::sync::Arc;

use crate::domain::error::AppError;
use crate::sse::event::SseEvent;
use crate::AppState;
use crate::api::middleware::auth::AuthUser;

#[derive(Serialize)]
pub struct InstantGameResponse {
    pub status: String,
    pub game_id: Option<i64>,
}

pub async fn join(
    State(state): State<Arc<AppState>>,
    AuthUser(user_id): AuthUser,
    Path(players_number): Path<u8>,
) -> Result<Json<InstantGameResponse>, AppError> {
    let matched = state
        .repo
        .join_instant_queue(user_id, players_number)
        .await?;

    if matched.len() >= players_number as usize {
        // Create game with matched players
        let game_id = state.repo.create_game().await?;
        let mut player_ids = Vec::new();

        for (i, &uid) in matched.iter().enumerate() {
            let pid = state
                .repo
                .add_player(uid, game_id, i as u8, i == 0, false)
                .await?;
            player_ids.push(pid);
        }

        state.repo.initialize_game(game_id, &player_ids).await?;

        // Broadcast to all waiting clients
        state
            .sse_broker
            .broadcast(game_id, SseEvent::InstantGameStarted { game_id })
            .await;

        Ok(Json(InstantGameResponse {
            status: "started".to_string(),
            game_id: Some(game_id.0),
        }))
    } else {
        let pseudo = state.repo.get_user_pseudo(user_id).await?;
        // We can't broadcast to a specific game here since no game exists yet.
        // Client polls or uses a global SSE endpoint for waiting room.
        let _ = pseudo; // Will be used when global SSE is implemented
        Ok(Json(InstantGameResponse {
            status: "waiting".to_string(),
            game_id: None,
        }))
    }
}
