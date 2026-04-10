//! Authentication handlers: login, register, guest.

use axum::extract::State;
use axum::Json;
use serde::{Deserialize, Serialize};
use std::sync::Arc;

use crate::domain::error::AppError;
use crate::AppState;

use super::middleware::auth::create_token;

#[derive(Deserialize)]
pub struct LoginRequest {
    pub pseudo: String,
    pub password: String,
}

#[derive(Deserialize)]
pub struct RegisterRequest {
    pub pseudo: String,
    pub email: Option<String>,
    pub first_name: Option<String>,
    pub last_name: Option<String>,
    pub password: String,
}

#[derive(Serialize)]
pub struct AuthResponse {
    pub token: String,
    pub pseudo: String,
}

pub async fn login(
    State(state): State<Arc<AppState>>,
    Json(req): Json<LoginRequest>,
) -> Result<Json<AuthResponse>, AppError> {
    let (user_id, password_hash) = state
        .repo
        .get_user_by_pseudo(&req.pseudo)
        .await?
        .ok_or_else(|| AppError::Auth("invalid credentials".to_string()))?;

    use argon2::PasswordVerifier;
    use password_hash::PasswordHash;
    let parsed = PasswordHash::new(&password_hash)
        .map_err(|_| AppError::Auth("invalid credentials".to_string()))?;
    argon2::Argon2::default()
        .verify_password(req.password.as_bytes(), &parsed)
        .map_err(|_| AppError::Auth("invalid credentials".to_string()))?;

    let token = create_token(user_id, &state.config.jwt_secret)?;
    Ok(Json(AuthResponse {
        token,
        pseudo: req.pseudo,
    }))
}

pub async fn register(
    State(state): State<Arc<AppState>>,
    Json(req): Json<RegisterRequest>,
) -> Result<Json<AuthResponse>, AppError> {
    use argon2::Argon2;
    use password_hash::rand_core::OsRng;
    use password_hash::{PasswordHasher, SaltString};

    let salt = SaltString::generate(&mut OsRng);
    let hash = Argon2::default()
        .hash_password(req.password.as_bytes(), &salt)
        .map_err(|e| AppError::Internal(format!("hash error: {e}")))?
        .to_string();

    let user_id = state
        .repo
        .create_user(
            &req.pseudo,
            req.email.as_deref(),
            req.first_name.as_deref(),
            req.last_name.as_deref(),
            &hash,
            false,
        )
        .await?;

    let token = create_token(user_id, &state.config.jwt_secret)?;
    Ok(Json(AuthResponse {
        token,
        pseudo: req.pseudo,
    }))
}

pub async fn register_guest(
    State(state): State<Arc<AppState>>,
) -> Result<Json<AuthResponse>, AppError> {
    let pseudo = format!("Guest-{}", uuid::Uuid::new_v4().as_simple().to_string().get(..8).unwrap_or("0000"));

    use argon2::Argon2;
    use password_hash::rand_core::OsRng;
    use password_hash::{PasswordHasher, SaltString};

    let salt = SaltString::generate(&mut OsRng);
    let hash = Argon2::default()
        .hash_password(b"guest-no-password", &salt)
        .map_err(|e| AppError::Internal(format!("hash error: {e}")))?
        .to_string();

    let user_id = state.repo.create_user(&pseudo, None, None, None, &hash, true).await?;
    let token = create_token(user_id, &state.config.jwt_secret)?;
    Ok(Json(AuthResponse { token, pseudo }))
}

pub async fn logout() -> axum::http::StatusCode {
    // JWT is stateless; client discards the token
    axum::http::StatusCode::NO_CONTENT
}
