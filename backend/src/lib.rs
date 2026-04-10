pub mod api;
pub mod config;
pub mod db;
pub mod domain;
pub mod neural;
pub mod sse;

use std::sync::Arc;

use config::Config;
use db::repository::Repository;
use sse::broker::SseBroker;

pub struct AppState {
    pub repo: Repository,
    pub sse_broker: Arc<SseBroker>,
    pub config: Config,
}
