//! User preferences: bookmarked opponents.

use axum::extract::{Path, State};
use axum::http::StatusCode;
use axum::Json;
use std::sync::Arc;

use crate::domain::error::AppError;
use crate::AppState;
use crate::api::middleware::auth::AuthUser;

pub async fn list_bookmarked(
    State(state): State<Arc<AppState>>,
    AuthUser(user_id): AuthUser,
) -> Result<Json<Vec<String>>, AppError> {
    let names = state.repo.get_bookmarked_opponents(user_id).await?;
    Ok(Json(names))
}

pub async fn add_bookmarked(
    State(state): State<Arc<AppState>>,
    AuthUser(user_id): AuthUser,
    Path(name): Path<String>,
) -> Result<StatusCode, AppError> {
    state.repo.add_bookmarked_opponent(user_id, &name).await?;
    Ok(StatusCode::NO_CONTENT)
}
