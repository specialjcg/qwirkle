//! Game management handlers: create, list, get.

use axum::extract::{Path, State};
use axum::http::StatusCode;
use axum::Json;
use serde::{Deserialize, Serialize};
use std::sync::Arc;

use crate::domain::error::AppError;
use crate::domain::game::{GameId, GameState};
use crate::AppState;
use crate::api::middleware::auth::AuthUser;

#[derive(Deserialize)]
pub struct CreateGameRequest {
    pub opponents: Vec<String>,
}

#[derive(Serialize)]
pub struct CreateGameResponse {
    pub game_id: GameId,
}

#[axum::debug_handler]
pub async fn create_game(
    State(state): State<Arc<AppState>>,
    AuthUser(user_id): AuthUser,
    Json(req): Json<CreateGameRequest>,
) -> Result<(StatusCode, Json<CreateGameResponse>), AppError> {
    let game_id = state.repo.create_game().await?;

    // Add the creator as first player (turn = true)
    let creator_pid = state
        .repo
        .add_player(user_id, game_id, 0, true, false)
        .await?;

    let mut player_ids = vec![creator_pid];

    // Add opponents
    for (i, opponent_name) in req.opponents.iter().enumerate() {
        if opponent_name.is_empty() {
            continue;
        }
        let is_bot = opponent_name.starts_with("bot");
        let opp_user_id = if is_bot {
            state.repo.get_or_create_bot_user(opponent_name).await?
        } else {
            let (uid, _) = state
                .repo
                .get_user_by_pseudo(opponent_name)
                .await?
                .ok_or_else(|| {
                    AppError::NotFound(format!("user '{opponent_name}' not found"))
                })?;
            uid
        };
        let pid = state
            .repo
            .add_player(opp_user_id, game_id, (i + 1) as u8, false, is_bot)
            .await?;
        player_ids.push(pid);
    }

    // Initialize bag and deal tiles
    state.repo.initialize_game(game_id, &player_ids).await?;

    Ok((StatusCode::CREATED, Json(CreateGameResponse { game_id })))
}

pub async fn list_user_games(
    State(state): State<Arc<AppState>>,
    AuthUser(user_id): AuthUser,
) -> Result<Json<Vec<i64>>, AppError> {
    let ids = state.repo.get_user_game_ids(user_id).await?;
    Ok(Json(ids.into_iter().map(|g| g.0).collect()))
}

pub async fn get_game(
    State(state): State<Arc<AppState>>,
    AuthUser(_user_id): AuthUser,
    Path(game_id): Path<i64>,
) -> Result<Json<GameState>, AppError> {
    let game = state.repo.get_game(GameId(game_id)).await?;
    Ok(Json(game.to_client_state()))
}

/// Create a spectator game: only bots play, the user is not a player.
/// Body: { "bots": ["bot1", "bot2"] }
#[derive(Deserialize)]
pub struct CreateSpectateRequest {
    pub bots: Vec<String>,
}

#[axum::debug_handler]
pub async fn create_spectate_game(
    State(state): State<Arc<AppState>>,
    AuthUser(user_id): AuthUser,
    Json(req): Json<CreateSpectateRequest>,
) -> Result<(StatusCode, Json<CreateGameResponse>), AppError> {
    if req.bots.len() < 2 {
        return Err(AppError::Internal("need at least 2 bots".into()));
    }

    let game_id = state.repo.create_spectate_game(user_id).await?;
    let mut player_ids = Vec::new();

    for (i, bot_name) in req.bots.iter().enumerate() {
        let bot_uid = state.repo.get_or_create_bot_user(bot_name).await?;
        let pid = state
            .repo
            .add_player(bot_uid, game_id, i as u8, i == 0, true)
            .await?;
        player_ids.push(pid);
    }

    state.repo.initialize_game(game_id, &player_ids).await?;

    // Trigger the first bot's turn so the game advances automatically
    let first_pid = player_ids[0];
    let state_clone = state.clone();
    tokio::spawn(async move {
        let _ = crate::api::action::auto_play_bot_public(state_clone, game_id, first_pid).await;
    });

    Ok((StatusCode::CREATED, Json(CreateGameResponse { game_id })))
}

pub async fn delete_game(
    State(state): State<Arc<AppState>>,
    AuthUser(user_id): AuthUser,
    Path(game_id): Path<i64>,
) -> Result<StatusCode, AppError> {
    let gid = GameId(game_id);

    // Allow if user is a player OR the spectator
    let players = state.repo.get_players(gid).await?;
    let is_player = players.iter().any(|p| p.user_id == user_id);
    let is_spectator = state.repo.is_spectator(gid, user_id).await?;

    if !is_player && !is_spectator {
        return Err(AppError::Auth("not authorized to delete this game".into()));
    }

    state.repo.delete_game(gid).await?;
    Ok(StatusCode::NO_CONTENT)
}
