//! JWT authentication middleware and extractor.

use axum::extract::{FromRequestParts, Request, State};
use axum::http::header::AUTHORIZATION;
use axum::http::request::Parts;
use axum::middleware::Next;
use axum::response::Response;
use jsonwebtoken::{decode, DecodingKey, Validation};
use serde::{Deserialize, Serialize};
use std::sync::Arc;

use crate::domain::error::AppError;
use crate::domain::player::UserId;
use crate::AppState;

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub sub: i64, // user_id
    pub exp: usize,
}

/// Extractor that reads the authenticated UserId from request extensions.
#[derive(Debug, Clone, Copy)]
pub struct AuthUser(pub UserId);

impl<S: Send + Sync> FromRequestParts<S> for AuthUser {
    type Rejection = AppError;

    async fn from_request_parts(parts: &mut Parts, _state: &S) -> Result<Self, Self::Rejection> {
        parts
            .extensions
            .get::<UserId>()
            .copied()
            .map(AuthUser)
            .ok_or_else(|| AppError::Auth("not authenticated".to_string()))
    }
}

/// Extract and validate JWT, inject UserId into request extensions.
pub async fn jwt_auth(
    State(state): State<Arc<AppState>>,
    mut req: Request,
    next: Next,
) -> Result<Response, AppError> {
    let header = req
        .headers()
        .get(AUTHORIZATION)
        .and_then(|v| v.to_str().ok())
        .ok_or_else(|| AppError::Auth("missing authorization header".to_string()))?;

    let token = header
        .strip_prefix("Bearer ")
        .ok_or_else(|| AppError::Auth("invalid authorization format".to_string()))?;

    let token_data = decode::<Claims>(
        token,
        &DecodingKey::from_secret(state.config.jwt_secret.as_bytes()),
        &Validation::default(),
    )
    .map_err(|e| AppError::Auth(format!("invalid token: {e}")))?;

    req.extensions_mut().insert(UserId(token_data.claims.sub));
    Ok(next.run(req).await)
}

/// Create a JWT token for a user.
pub fn create_token(user_id: UserId, secret: &str) -> Result<String, AppError> {
    use jsonwebtoken::{encode, EncodingKey, Header};

    let exp = chrono_exp_1_week();
    let claims = Claims {
        sub: user_id.0,
        exp,
    };
    encode(
        &Header::default(),
        &claims,
        &EncodingKey::from_secret(secret.as_bytes()),
    )
    .map_err(|e| AppError::Internal(format!("token creation failed: {e}")))
}

fn chrono_exp_1_week() -> usize {
    use std::time::{SystemTime, UNIX_EPOCH};
    let now = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .expect("time went backwards")
        .as_secs();
    (now + 7 * 24 * 3600) as usize
}

#[cfg(test)]
mod tests {
    use super::*;
    use jsonwebtoken::{decode, DecodingKey, Validation};

    const SECRET: &str = "test-secret-key";

    #[test]
    fn create_and_decode_token() {
        let user_id = UserId(42);
        let token = create_token(user_id, SECRET).unwrap();

        let data = decode::<Claims>(
            &token,
            &DecodingKey::from_secret(SECRET.as_bytes()),
            &Validation::default(),
        )
        .unwrap();

        assert_eq!(data.claims.sub, 42);
        assert!(data.claims.exp > 0);
    }

    #[test]
    fn token_with_wrong_secret_fails() {
        let token = create_token(UserId(1), SECRET).unwrap();

        let result = decode::<Claims>(
            &token,
            &DecodingKey::from_secret(b"wrong-secret"),
            &Validation::default(),
        );

        assert!(result.is_err());
    }

    #[test]
    fn token_expiry_is_in_future() {
        use std::time::{SystemTime, UNIX_EPOCH};

        let token = create_token(UserId(1), SECRET).unwrap();
        let data = decode::<Claims>(
            &token,
            &DecodingKey::from_secret(SECRET.as_bytes()),
            &Validation::default(),
        )
        .unwrap();

        let now = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_secs() as usize;

        assert!(data.claims.exp > now);
        // Should be roughly 1 week in the future
        assert!(data.claims.exp - now > 6 * 24 * 3600);
        assert!(data.claims.exp - now < 8 * 24 * 3600);
    }

    #[test]
    fn different_users_get_different_tokens() {
        let t1 = create_token(UserId(1), SECRET).unwrap();
        let t2 = create_token(UserId(2), SECRET).unwrap();
        assert_ne!(t1, t2);
    }
}
