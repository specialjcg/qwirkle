//! Integration tests: test the full API flow via HTTP.
//!
//! Each test creates an in-memory SQLite database, boots the Axum app,
//! and sends real HTTP requests.

use axum::body::Body;
use axum::http::{header, Method, Request, StatusCode};
use axum::middleware;
use axum::routing::{get, post};
use axum::Router;
use serde_json::{json, Value};
use sqlx::sqlite::SqlitePoolOptions;
use std::sync::Arc;
use tower::ServiceExt;

use qwirkle_backend::api;
use qwirkle_backend::config::Config;
use qwirkle_backend::db::repository::Repository;
use qwirkle_backend::sse::broker::SseBroker;
use qwirkle_backend::AppState;

async fn setup() -> (Router, Arc<AppState>) {
    let pool = SqlitePoolOptions::new()
        .connect("sqlite::memory:")
        .await
        .unwrap();

    let repo = Repository::new(pool);
    repo.migrate().await.unwrap();

    let config = Config {
        port: 0,
        database_url: "sqlite::memory:".to_string(),
        jwt_secret: "test-secret".to_string(),
        cors_origin: "*".to_string(),
    };

    let sse_broker = SseBroker::new();
    let state = Arc::new(AppState {
        repo,
        sse_broker,
        config,
    });

    let public = Router::new()
        .route("/api/auth/login", post(api::auth::login))
        .route("/api/auth/register", post(api::auth::register))
        .route("/api/auth/guest", post(api::auth::register_guest))
        .with_state(state.clone());

    let protected = Router::new()
        .route("/api/auth/logout", post(api::auth::logout))
        .route(
            "/api/games",
            get(api::game::list_user_games).post(api::game::create_game),
        )
        .route("/api/games/{id}", get(api::game::get_game))
        .route("/api/games/{id}/players", get(api::player::get_players))
        .route("/api/games/{id}/turn", get(api::player::get_name_turn))
        .route("/api/games/{id}/winners", get(api::player::get_winners))
        .route("/api/games/{id}/play", post(api::action::play_tiles))
        .route(
            "/api/games/{id}/simulate",
            post(api::action::simulate_play),
        )
        .route("/api/games/{id}/swap", post(api::action::swap_tiles))
        .route("/api/games/{id}/skip", post(api::action::skip_turn))
        .route(
            "/api/games/{id}/arrange-rack",
            post(api::action::arrange_rack),
        )
        .route(
            "/api/games/{id}/ai/best-moves",
            get(api::action::ai_best_moves),
        )
        .route(
            "/api/user/bookmarked-opponents",
            get(api::user_prefs::list_bookmarked),
        )
        .route(
            "/api/user/bookmarked-opponents/{name}",
            post(api::user_prefs::add_bookmarked),
        )
        .layer(middleware::from_fn_with_state(
            state.clone(),
            api::middleware::auth::jwt_auth,
        ))
        .with_state(state.clone());

    let app = Router::new().merge(public).merge(protected);
    (app, state)
}

async fn body_json(response: axum::response::Response) -> Value {
    let bytes = axum::body::to_bytes(response.into_body(), 1_000_000)
        .await
        .unwrap();
    serde_json::from_slice(&bytes).unwrap()
}

async fn register_guest(app: &Router) -> (String, String) {
    let resp = app
        .clone()
        .oneshot(
            Request::builder()
                .method(Method::POST)
                .uri("/api/auth/guest")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(resp.status(), StatusCode::OK);
    let json = body_json(resp).await;
    let token = json["token"].as_str().unwrap().to_string();
    let pseudo = json["pseudo"].as_str().unwrap().to_string();
    (token, pseudo)
}

fn auth_request(method: Method, uri: &str, token: &str, body: Option<Value>) -> Request<Body> {
    let mut builder = Request::builder()
        .method(method)
        .uri(uri)
        .header(header::AUTHORIZATION, format!("Bearer {token}"));

    if let Some(b) = body {
        builder = builder.header(header::CONTENT_TYPE, "application/json");
        builder.body(Body::from(serde_json::to_vec(&b).unwrap())).unwrap()
    } else {
        builder.body(Body::empty()).unwrap()
    }
}

// ── Tests ──

#[tokio::test]
async fn guest_registration() {
    let (app, _) = setup().await;
    let (token, pseudo) = register_guest(&app).await;
    assert!(!token.is_empty());
    assert!(pseudo.starts_with("Guest-"));
}

#[tokio::test]
async fn register_and_login() {
    let (app, _) = setup().await;

    // Register
    let resp = app
        .clone()
        .oneshot(
            Request::builder()
                .method(Method::POST)
                .uri("/api/auth/register")
                .header(header::CONTENT_TYPE, "application/json")
                .body(Body::from(
                    serde_json::to_vec(&json!({
                        "pseudo": "alice",
                        "email": "alice@test.com",
                        "password": "secret123"
                    }))
                    .unwrap(),
                ))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(resp.status(), StatusCode::OK);
    let json = body_json(resp).await;
    assert_eq!(json["pseudo"], "alice");

    // Login
    let resp = app
        .clone()
        .oneshot(
            Request::builder()
                .method(Method::POST)
                .uri("/api/auth/login")
                .header(header::CONTENT_TYPE, "application/json")
                .body(Body::from(
                    serde_json::to_vec(&json!({
                        "pseudo": "alice",
                        "password": "secret123"
                    }))
                    .unwrap(),
                ))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(resp.status(), StatusCode::OK);
    let json = body_json(resp).await;
    assert!(!json["token"].as_str().unwrap().is_empty());
}

#[tokio::test]
async fn login_wrong_password() {
    let (app, _) = setup().await;

    // Register first
    app.clone()
        .oneshot(
            Request::builder()
                .method(Method::POST)
                .uri("/api/auth/register")
                .header(header::CONTENT_TYPE, "application/json")
                .body(Body::from(
                    serde_json::to_vec(&json!({
                        "pseudo": "bob",
                        "password": "correct"
                    }))
                    .unwrap(),
                ))
                .unwrap(),
        )
        .await
        .unwrap();

    // Wrong password
    let resp = app
        .clone()
        .oneshot(
            Request::builder()
                .method(Method::POST)
                .uri("/api/auth/login")
                .header(header::CONTENT_TYPE, "application/json")
                .body(Body::from(
                    serde_json::to_vec(&json!({
                        "pseudo": "bob",
                        "password": "wrong"
                    }))
                    .unwrap(),
                ))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(resp.status(), StatusCode::UNAUTHORIZED);
}

#[tokio::test]
async fn protected_route_without_token() {
    let (app, _) = setup().await;

    let resp = app
        .clone()
        .oneshot(
            Request::builder()
                .method(Method::GET)
                .uri("/api/games")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(resp.status(), StatusCode::UNAUTHORIZED);
}

#[tokio::test]
async fn create_game_vs_bot_and_get_state() {
    let (app, _) = setup().await;
    let (token, _pseudo) = register_guest(&app).await;

    // Create game vs bot
    let resp = app
        .clone()
        .oneshot(auth_request(
            Method::POST,
            "/api/games",
            &token,
            Some(json!({ "opponents": ["bot1"] })),
        ))
        .await
        .unwrap();

    assert_eq!(resp.status(), StatusCode::CREATED);
    let json = body_json(resp).await;
    let game_id = json["game_id"].as_i64().unwrap();
    assert!(game_id > 0);

    // Get game state
    let resp = app
        .clone()
        .oneshot(auth_request(
            Method::GET,
            &format!("/api/games/{game_id}"),
            &token,
            None,
        ))
        .await
        .unwrap();

    assert_eq!(resp.status(), StatusCode::OK);
    let state = body_json(resp).await;
    assert_eq!(state["id"], game_id);
    assert_eq!(state["players"].as_array().unwrap().len(), 2);
    assert!(state["bag_count"].as_i64().unwrap() > 0);

    // Each player should have 6 tiles in rack
    for player in state["players"].as_array().unwrap() {
        assert_eq!(player["rack"].as_array().unwrap().len(), 6);
    }
}

#[tokio::test]
async fn list_user_games() {
    let (app, _) = setup().await;
    let (token, _) = register_guest(&app).await;

    // No games initially
    let resp = app
        .clone()
        .oneshot(auth_request(Method::GET, "/api/games", &token, None))
        .await
        .unwrap();

    assert_eq!(resp.status(), StatusCode::OK);
    let games = body_json(resp).await;
    assert_eq!(games.as_array().unwrap().len(), 0);

    // Create a game
    app.clone()
        .oneshot(auth_request(
            Method::POST,
            "/api/games",
            &token,
            Some(json!({ "opponents": ["bot1"] })),
        ))
        .await
        .unwrap();

    // Now should have 1 game
    let resp = app
        .clone()
        .oneshot(auth_request(Method::GET, "/api/games", &token, None))
        .await
        .unwrap();

    let games = body_json(resp).await;
    assert_eq!(games.as_array().unwrap().len(), 1);
}

#[tokio::test]
async fn skip_turn() {
    let (app, _) = setup().await;
    let (token, _) = register_guest(&app).await;

    // Create game
    let resp = app
        .clone()
        .oneshot(auth_request(
            Method::POST,
            "/api/games",
            &token,
            Some(json!({ "opponents": ["bot1"] })),
        ))
        .await
        .unwrap();
    let game_id = body_json(resp).await["game_id"].as_i64().unwrap();

    // Skip turn
    let resp = app
        .clone()
        .oneshot(auth_request(
            Method::POST,
            &format!("/api/games/{game_id}/skip"),
            &token,
            None,
        ))
        .await
        .unwrap();

    // Should succeed (204) or the bot auto-plays and state changes
    assert!(
        resp.status() == StatusCode::NO_CONTENT || resp.status() == StatusCode::OK,
        "Expected 204 or 200, got {}",
        resp.status()
    );
}

#[tokio::test]
async fn swap_tiles() {
    let (app, _) = setup().await;
    let (token, _) = register_guest(&app).await;

    // Create game
    let resp = app
        .clone()
        .oneshot(auth_request(
            Method::POST,
            "/api/games",
            &token,
            Some(json!({ "opponents": ["bot1"] })),
        ))
        .await
        .unwrap();
    let game_id = body_json(resp).await["game_id"].as_i64().unwrap();

    // Get game to know our rack
    let resp = app
        .clone()
        .oneshot(auth_request(
            Method::GET,
            &format!("/api/games/{game_id}"),
            &token,
            None,
        ))
        .await
        .unwrap();
    let state = body_json(resp).await;
    let my_rack = state["players"][0]["rack"].as_array().unwrap();
    let first_tile = &my_rack[0];

    // Swap first tile
    let resp = app
        .clone()
        .oneshot(auth_request(
            Method::POST,
            &format!("/api/games/{game_id}/swap"),
            &token,
            Some(json!({
                "tiles": [{
                    "color": first_tile["face"]["color"],
                    "shape": first_tile["face"]["shape"]
                }]
            })),
        ))
        .await
        .unwrap();

    assert_eq!(resp.status(), StatusCode::OK);
    let result = body_json(resp).await;
    assert!(result["new_rack"].as_array().unwrap().len() >= 5);
}

#[tokio::test]
async fn bookmarked_opponents() {
    let (app, _) = setup().await;
    let (token, _) = register_guest(&app).await;

    // Initially empty
    let resp = app
        .clone()
        .oneshot(auth_request(
            Method::GET,
            "/api/user/bookmarked-opponents",
            &token,
            None,
        ))
        .await
        .unwrap();
    assert_eq!(body_json(resp).await.as_array().unwrap().len(), 0);

    // Add a bookmark
    let resp = app
        .clone()
        .oneshot(auth_request(
            Method::POST,
            "/api/user/bookmarked-opponents/alice",
            &token,
            None,
        ))
        .await
        .unwrap();
    assert_eq!(resp.status(), StatusCode::NO_CONTENT);

    // Now should have 1
    let resp = app
        .clone()
        .oneshot(auth_request(
            Method::GET,
            "/api/user/bookmarked-opponents",
            &token,
            None,
        ))
        .await
        .unwrap();
    let bookmarks = body_json(resp).await;
    assert_eq!(bookmarks.as_array().unwrap().len(), 1);
    assert_eq!(bookmarks[0], "alice");
}

#[tokio::test]
async fn simulate_play_without_persisting() {
    let (app, _) = setup().await;
    let (token, _) = register_guest(&app).await;

    // Create game
    let resp = app
        .clone()
        .oneshot(auth_request(
            Method::POST,
            "/api/games",
            &token,
            Some(json!({ "opponents": ["bot1"] })),
        ))
        .await
        .unwrap();
    let game_id = body_json(resp).await["game_id"].as_i64().unwrap();

    // Get rack
    let resp = app
        .clone()
        .oneshot(auth_request(
            Method::GET,
            &format!("/api/games/{game_id}"),
            &token,
            None,
        ))
        .await
        .unwrap();
    let state = body_json(resp).await;
    let rack = state["players"][0]["rack"].as_array().unwrap();
    let tile = &rack[0];

    // Simulate placing first tile at origin
    let resp = app
        .clone()
        .oneshot(auth_request(
            Method::POST,
            &format!("/api/games/{game_id}/simulate"),
            &token,
            Some(json!([{
                "tile": tile["face"],
                "coordinate": {"x": 0, "y": 0}
            }])),
        ))
        .await
        .unwrap();

    assert_eq!(resp.status(), StatusCode::OK);
    let result = body_json(resp).await;
    assert_eq!(result["code"], "ok");
    assert!(result["points"].as_i64().unwrap() >= 1);

    // Verify board is still empty (simulation didn't persist)
    let resp = app
        .clone()
        .oneshot(auth_request(
            Method::GET,
            &format!("/api/games/{game_id}"),
            &token,
            None,
        ))
        .await
        .unwrap();
    let state = body_json(resp).await;
    assert_eq!(state["board"].as_array().unwrap().len(), 0);
}

#[tokio::test]
async fn play_tiles_and_verify_board() {
    let (app, _) = setup().await;
    let (token, _) = register_guest(&app).await;

    // Create game
    let resp = app
        .clone()
        .oneshot(auth_request(
            Method::POST,
            "/api/games",
            &token,
            Some(json!({ "opponents": ["bot1"] })),
        ))
        .await
        .unwrap();
    let game_id = body_json(resp).await["game_id"].as_i64().unwrap();

    // Get rack
    let resp = app
        .clone()
        .oneshot(auth_request(
            Method::GET,
            &format!("/api/games/{game_id}"),
            &token,
            None,
        ))
        .await
        .unwrap();
    let state = body_json(resp).await;
    let tile = &state["players"][0]["rack"].as_array().unwrap()[0];

    // Play tile at origin
    let resp = app
        .clone()
        .oneshot(auth_request(
            Method::POST,
            &format!("/api/games/{game_id}/play"),
            &token,
            Some(json!([{
                "tile": tile["face"],
                "coordinate": {"x": 0, "y": 0}
            }])),
        ))
        .await
        .unwrap();

    assert_eq!(resp.status(), StatusCode::OK);
    let result = body_json(resp).await;
    assert_eq!(result["code"], "ok");
    assert!(result["points"].as_i64().unwrap() >= 1);

    // Verify board has the tile now
    let resp = app
        .clone()
        .oneshot(auth_request(
            Method::GET,
            &format!("/api/games/{game_id}"),
            &token,
            None,
        ))
        .await
        .unwrap();
    let state = body_json(resp).await;
    // Board should have >= 1 tile (our tile + possibly bot's auto-play)
    assert!(state["board"].as_array().unwrap().len() >= 1);
}

#[tokio::test]
async fn get_nonexistent_game_returns_404() {
    let (app, _) = setup().await;
    let (token, _) = register_guest(&app).await;

    let resp = app
        .clone()
        .oneshot(auth_request(
            Method::GET,
            "/api/games/99999",
            &token,
            None,
        ))
        .await
        .unwrap();

    assert_eq!(resp.status(), StatusCode::NOT_FOUND);
}

#[tokio::test]
async fn get_players_and_turn() {
    let (app, _) = setup().await;
    let (token, _) = register_guest(&app).await;

    // Create game
    let resp = app
        .clone()
        .oneshot(auth_request(
            Method::POST,
            "/api/games",
            &token,
            Some(json!({ "opponents": ["bot1"] })),
        ))
        .await
        .unwrap();
    let game_id = body_json(resp).await["game_id"].as_i64().unwrap();

    // Get players
    let resp = app
        .clone()
        .oneshot(auth_request(
            Method::GET,
            &format!("/api/games/{game_id}/players"),
            &token,
            None,
        ))
        .await
        .unwrap();
    assert_eq!(resp.status(), StatusCode::OK);
    let players = body_json(resp).await;
    assert_eq!(players.as_array().unwrap().len(), 2);

    // Get turn
    let resp = app
        .clone()
        .oneshot(auth_request(
            Method::GET,
            &format!("/api/games/{game_id}/turn"),
            &token,
            None,
        ))
        .await
        .unwrap();
    assert_eq!(resp.status(), StatusCode::OK);
    let turn = body_json(resp).await;
    assert!(!turn["pseudo"].as_str().unwrap().is_empty());

    // Get winners (game not finished)
    let resp = app
        .clone()
        .oneshot(auth_request(
            Method::GET,
            &format!("/api/games/{game_id}/winners"),
            &token,
            None,
        ))
        .await
        .unwrap();
    assert_eq!(resp.status(), StatusCode::OK);
    let winners = body_json(resp).await;
    assert_eq!(winners.as_array().unwrap().len(), 0);
}

#[tokio::test]
async fn duplicate_registration_fails() {
    let (app, _) = setup().await;

    // Register alice
    let resp = app
        .clone()
        .oneshot(
            Request::builder()
                .method(Method::POST)
                .uri("/api/auth/register")
                .header(header::CONTENT_TYPE, "application/json")
                .body(Body::from(
                    serde_json::to_vec(&json!({
                        "pseudo": "alice",
                        "password": "pass123"
                    }))
                    .unwrap(),
                ))
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(resp.status(), StatusCode::OK);

    // Register alice again - should fail
    let resp = app
        .clone()
        .oneshot(
            Request::builder()
                .method(Method::POST)
                .uri("/api/auth/register")
                .header(header::CONTENT_TYPE, "application/json")
                .body(Body::from(
                    serde_json::to_vec(&json!({
                        "pseudo": "alice",
                        "password": "other"
                    }))
                    .unwrap(),
                ))
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(resp.status(), StatusCode::INTERNAL_SERVER_ERROR);
}

#[tokio::test]
async fn ai_best_moves_endpoint() {
    let (app, _) = setup().await;
    let (token, _) = register_guest(&app).await;

    // Create game and play first tile to have a non-empty board
    let resp = app
        .clone()
        .oneshot(auth_request(
            Method::POST,
            "/api/games",
            &token,
            Some(json!({ "opponents": ["bot1"] })),
        ))
        .await
        .unwrap();
    let game_id = body_json(resp).await["game_id"].as_i64().unwrap();

    // Get AI best moves
    let resp = app
        .clone()
        .oneshot(auth_request(
            Method::GET,
            &format!("/api/games/{game_id}/ai/best-moves"),
            &token,
            None,
        ))
        .await
        .unwrap();

    assert_eq!(resp.status(), StatusCode::OK);
    let moves = body_json(resp).await;
    assert!(moves.as_array().is_some());
}
