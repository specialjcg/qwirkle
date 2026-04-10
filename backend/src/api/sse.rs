//! SSE event stream handler.
//!
//! EventSource API doesn't support custom headers, so the SSE endpoint
//! accepts the JWT token as a query parameter `?token=...`.

use axum::extract::{Path, Query, State};
use axum::response::sse::{Event, Sse};
use futures::stream::Stream;
use jsonwebtoken::{decode, DecodingKey, Validation};
use serde::Deserialize;
use std::convert::Infallible;
use std::sync::Arc;
use tokio_stream::wrappers::ReceiverStream;
use tokio_stream::StreamExt;

use crate::api::middleware::auth::Claims;
use crate::domain::error::AppError;
use crate::domain::game::GameId;
use crate::AppState;

#[derive(Deserialize)]
pub struct SseQuery {
    pub token: Option<String>,
}

pub async fn game_events(
    State(state): State<Arc<AppState>>,
    Path(game_id): Path<i64>,
    Query(query): Query<SseQuery>,
) -> Result<Sse<impl Stream<Item = Result<Event, Infallible>>>, AppError> {
    // Validate token from query param
    let token = query
        .token
        .ok_or_else(|| AppError::Auth("missing token query parameter".to_string()))?;

    decode::<Claims>(
        &token,
        &DecodingKey::from_secret(state.config.jwt_secret.as_bytes()),
        &Validation::default(),
    )
    .map_err(|e| AppError::Auth(format!("invalid token: {e}")))?;

    let rx = state.sse_broker.subscribe(GameId(game_id)).await;
    let stream = ReceiverStream::new(rx).map(|event| {
        let data = serde_json::to_string(&event).unwrap_or_default();
        Ok(Event::default().data(data))
    });
    Ok(Sse::new(stream))
}
