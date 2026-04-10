use std::sync::Arc;

use axum::middleware;
use axum::routing::{get, post};
use axum::Router;
use sqlx::sqlite::SqlitePoolOptions;
use tower_http::cors::{Any, CorsLayer};
use tower_http::services::{ServeDir, ServeFile};
use tracing_subscriber::EnvFilter;

use qwirkle_backend::config::Config;
use qwirkle_backend::db::repository::Repository;
use qwirkle_backend::sse::broker::SseBroker;
use qwirkle_backend::{api, AppState};

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt()
        .with_env_filter(EnvFilter::from_default_env().add_directive("info".parse().unwrap()))
        .init();

    let config = Config::from_env();

    let pool = SqlitePoolOptions::new()
        .max_connections(5)
        .connect(&config.database_url)
        .await
        .expect("failed to connect to database");

    let repo = Repository::new(pool);
    repo.migrate().await.expect("migration failed");

    // Try to load neural bot model (no-op if feature disabled or file missing)
    if qwirkle_backend::domain::neural_bot::ensure_loaded() {
        tracing::info!("Neural bot enabled");
    } else {
        tracing::info!("Neural bot disabled (no model or feature off)");
    }

    let sse_broker = SseBroker::new();

    let state = Arc::new(AppState {
        repo,
        sse_broker,
        config: config.clone(),
    });

    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any);

    // Public routes (no auth)
    let public = Router::new()
        .route("/api/auth/login", post(api::auth::login))
        .route("/api/auth/register", post(api::auth::register))
        .route("/api/auth/guest", post(api::auth::register_guest))
        .with_state(state.clone());

    // Protected routes (require JWT)
    let protected = Router::new()
        .route("/api/auth/logout", post(api::auth::logout))
        .route("/api/games", get(api::game::list_user_games).post(api::game::create_game))
        .route("/api/games/spectate", post(api::game::create_spectate_game))
        .route("/api/games/{id}", get(api::game::get_game).delete(api::game::delete_game))
        .route("/api/games/{id}/players", get(api::player::get_players))
        .route("/api/games/{id}/turn", get(api::player::get_name_turn))
        .route("/api/games/{id}/winners", get(api::player::get_winners))
        .route("/api/games/{id}/play", post(api::action::play_tiles))
        .route("/api/games/{id}/simulate", post(api::action::simulate_play))
        .route("/api/games/{id}/arrange-rack", post(api::action::arrange_rack))
        .route("/api/games/{id}/swap", post(api::action::swap_tiles))
        .route("/api/games/{id}/skip", post(api::action::skip_turn))
        .route("/api/games/{id}/ai/best-moves", get(api::action::ai_best_moves))
        .route("/api/instant-game/join/{n}", post(api::instant_game::join))
        .route("/api/user/bookmarked-opponents", get(api::user_prefs::list_bookmarked))
        .route("/api/user/bookmarked-opponents/{name}", post(api::user_prefs::add_bookmarked))
        .layer(middleware::from_fn_with_state(
            state.clone(),
            api::middleware::auth::jwt_auth,
        ))
        .with_state(state.clone());

    // SSE route — auth via query param (EventSource doesn't support headers)
    let sse_routes = Router::new()
        .route("/api/games/{id}/events", get(api::sse::game_events))
        .with_state(state);

    // Serve frontend static files — resolve path relative to the binary
    let static_dir = std::env::var("STATIC_DIR")
        .unwrap_or_else(|_| "../frontend/static".to_string());
    let serve_static = ServeDir::new(&static_dir)
        .fallback(ServeFile::new(format!("{static_dir}/index.html")));

    let app = Router::new()
        .merge(public)
        .merge(protected)
        .merge(sse_routes)
        .fallback_service(serve_static)
        .layer(cors);

    let addr = format!("0.0.0.0:{}", config.port);
    tracing::info!("Starting server on {addr}");
    tracing::info!("Frontend served from {static_dir}");
    let listener = tokio::net::TcpListener::bind(&addr)
        .await
        .expect("failed to bind");
    axum::serve(listener, app).await.expect("server error");
}
