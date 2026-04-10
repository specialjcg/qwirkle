//! Player information handlers.

use axum::extract::{Path, State};
use axum::Json;
use serde::Serialize;
use std::sync::Arc;

use crate::domain::error::AppError;
use crate::domain::game::GameId;
use crate::domain::player::Player;
use crate::AppState;
use crate::api::middleware::auth::AuthUser;

#[derive(Serialize)]
pub struct TurnInfo {
    pub player_id: i64,
    pub pseudo: String,
}

pub async fn get_players(
    State(state): State<Arc<AppState>>,
    AuthUser(_user_id): AuthUser,
    Path(game_id): Path<i64>,
) -> Result<Json<Vec<Player>>, AppError> {
    let players = state.repo.get_players(GameId(game_id)).await?;
    Ok(Json(players))
}

pub async fn get_name_turn(
    State(state): State<Arc<AppState>>,
    AuthUser(_user_id): AuthUser,
    Path(game_id): Path<i64>,
) -> Result<Json<TurnInfo>, AppError> {
    let player = state
        .repo
        .get_current_turn_player(GameId(game_id))
        .await?
        .ok_or_else(|| AppError::NotFound("no current turn player".to_string()))?;

    Ok(Json(TurnInfo {
        player_id: player.id.0,
        pseudo: player.pseudo,
    }))
}

pub async fn get_winners(
    State(state): State<Arc<AppState>>,
    AuthUser(_user_id): AuthUser,
    Path(game_id): Path<i64>,
) -> Result<Json<Vec<i64>>, AppError> {
    let game = state.repo.get_game(GameId(game_id)).await?;

    if game.status != crate::domain::game::GameStatus::Finished {
        return Ok(Json(vec![]));
    }

    let max_points = game.players.iter().map(|p| p.points).max().unwrap_or(0);
    let winners: Vec<i64> = game
        .players
        .iter()
        .filter(|p| p.points == max_points)
        .map(|p| p.id.0)
        .collect();

    Ok(Json(winners))
}
