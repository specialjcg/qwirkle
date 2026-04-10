//! Map AppError to HTTP responses.

use axum::http::StatusCode;
use axum::response::{IntoResponse, Response};
use axum::Json;
use serde_json::json;

use crate::domain::error::{AppError, GameError};

impl IntoResponse for AppError {
    fn into_response(self) -> Response {
        let (status, code, message) = match &self {
            AppError::Game(ge) => {
                let code = match ge {
                    GameError::NotPlayerTurn => "not_player_turn",
                    GameError::PlayerDoesntHaveTile(_) => "player_doesnt_have_tile",
                    GameError::TileIsolated => "tile_isolated",
                    GameError::InvalidRow => "invalid_row",
                    GameError::PositionNotFree { .. } => "position_not_free",
                    GameError::NotBestMove => "not_best_move",
                };
                (StatusCode::BAD_REQUEST, code, self.to_string())
            }
            AppError::Auth(_) => (
                StatusCode::UNAUTHORIZED,
                "auth_failed",
                self.to_string(),
            ),
            AppError::NotFound(_) => (
                StatusCode::NOT_FOUND,
                "not_found",
                self.to_string(),
            ),
            AppError::Db(_) => (
                StatusCode::INTERNAL_SERVER_ERROR,
                "database_error",
                "internal error".to_string(),
            ),
            AppError::Internal(_) => (
                StatusCode::INTERNAL_SERVER_ERROR,
                "internal_error",
                "internal error".to_string(),
            ),
        };

        (status, Json(json!({ "code": code, "message": message }))).into_response()
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::domain::tile::TileFace;
    use crate::domain::color::Color;
    use crate::domain::shape::Shape;
    use axum::response::IntoResponse;

    fn status_of(err: AppError) -> StatusCode {
        err.into_response().status()
    }

    #[test]
    fn game_errors_return_400() {
        assert_eq!(status_of(AppError::Game(GameError::NotPlayerTurn)), StatusCode::BAD_REQUEST);
        assert_eq!(status_of(AppError::Game(GameError::TileIsolated)), StatusCode::BAD_REQUEST);
        assert_eq!(status_of(AppError::Game(GameError::InvalidRow)), StatusCode::BAD_REQUEST);
        assert_eq!(
            status_of(AppError::Game(GameError::PositionNotFree { x: 0, y: 0 })),
            StatusCode::BAD_REQUEST
        );
        assert_eq!(
            status_of(AppError::Game(GameError::PlayerDoesntHaveTile(TileFace {
                color: Color::Red,
                shape: Shape::Circle,
            }))),
            StatusCode::BAD_REQUEST
        );
    }

    #[test]
    fn auth_error_returns_401() {
        assert_eq!(
            status_of(AppError::Auth("bad".to_string())),
            StatusCode::UNAUTHORIZED
        );
    }

    #[test]
    fn not_found_returns_404() {
        assert_eq!(
            status_of(AppError::NotFound("x".to_string())),
            StatusCode::NOT_FOUND
        );
    }

    #[test]
    fn internal_error_returns_500() {
        assert_eq!(
            status_of(AppError::Internal("oops".to_string())),
            StatusCode::INTERNAL_SERVER_ERROR
        );
    }
}
