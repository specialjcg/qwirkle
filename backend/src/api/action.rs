//! Game action handlers: play, simulate, swap, skip, arrange rack, AI.

use axum::extract::{Path, State};
use axum::Json;
use serde::{Deserialize, Serialize};
use std::sync::Arc;

use crate::domain::ai;
use crate::domain::neural_bot::{bot_kind_from_pseudo, mcts_best_move, BotKind, DEFAULT_MCTS_SIMS};
use crate::domain::error::{AppError, GameError};
use crate::domain::game::{GameId, GameStatus};
use crate::domain::rules::validate_and_score;
use crate::domain::tile::{BoardTile, Coordinate, RackTile, TileFace};
use crate::sse::event::SseEvent;
use crate::AppState;
use crate::api::middleware::auth::AuthUser;

#[derive(Deserialize)]
pub struct TilePlacement {
    pub tile: TileFace,
    pub coordinate: Coordinate,
}

#[derive(Serialize)]
pub struct PlayResult {
    pub code: String,
    pub points: i32,
    pub new_rack: Vec<RackTile>,
}

#[derive(Serialize)]
pub struct SimulationResult {
    pub code: String,
    pub points: i32,
}

#[derive(Deserialize)]
pub struct SwapRequest {
    pub tiles: Vec<TileFace>,
}

#[derive(Serialize)]
pub struct SwapResult {
    pub new_rack: Vec<RackTile>,
}

#[derive(Deserialize)]
pub struct ArrangeRackRequest {
    pub tiles: Vec<RackTileDto>,
}

#[derive(Deserialize)]
pub struct RackTileDto {
    pub tile: TileFace,
    pub rack_position: u8,
}

#[derive(Serialize)]
pub struct AiMove {
    pub tiles: Vec<BoardTile>,
    pub score: i32,
}

pub async fn play_tiles(
    State(state): State<Arc<AppState>>,
    AuthUser(user_id): AuthUser,
    Path(game_id): Path<i64>,
    Json(placements): Json<Vec<TilePlacement>>,
) -> Result<Json<PlayResult>, AppError> {
    let gid = GameId(game_id);
    let game = state.repo.get_game(gid).await?;

    // Find the player for this user in this game
    let player = game
        .players
        .iter()
        .find(|p| p.user_id == user_id)
        .ok_or_else(|| AppError::NotFound("player not in game".to_string()))?;

    if !player.is_turn {
        return Err(GameError::NotPlayerTurn.into());
    }

    let board_tiles: Vec<BoardTile> = placements
        .iter()
        .map(|p| BoardTile {
            face: p.tile,
            coordinate: p.coordinate,
        })
        .collect();

    // Check player has all tiles
    let played_faces: Vec<TileFace> = board_tiles.iter().map(|t| t.face).collect();
    for face in &played_faces {
        if !player.rack.iter().any(|r| r.face == *face) {
            return Err(GameError::PlayerDoesntHaveTile(*face).into());
        }
    }

    // Validate and score
    let points = validate_and_score(&game.board, &board_tiles)?;

    // Apply: place tiles, remove from rack, draw new, update score, advance turn
    let pid = player.id;
    state.repo.place_tiles(gid, pid, &board_tiles).await?;
    state.repo.remove_from_rack(pid, &played_faces).await?;
    let drawn = state
        .repo
        .draw_from_bag(gid, played_faces.len())
        .await?;
    let new_rack = state.repo.add_to_rack(pid, &drawn).await?;
    state.repo.update_player_score(pid, points).await?;

    // Check for game over (player emptied rack and bag is empty)
    let bag = state.repo.get_bag_tiles(gid).await?;
    let remaining_rack = state.repo.get_rack(pid).await?;
    if remaining_rack.is_empty() && bag.is_empty() {
        state
            .repo
            .set_game_status(gid, GameStatus::Finished)
            .await?;
        let winners: Vec<_> = {
            let players = state.repo.get_players(gid).await?;
            let max = players.iter().map(|p| p.points).max().unwrap_or(0);
            players.iter().filter(|p| p.points == max).map(|p| p.id).collect()
        };
        state
            .sse_broker
            .broadcast(gid, SseEvent::GameOver { winner_ids: winners })
            .await;
    } else {
        let next_pid = state.repo.advance_turn(gid).await?;
        let next_pseudo = state.repo.get_players(gid).await?.into_iter().find(|p| p.id == next_pid).map(|p| p.pseudo).unwrap_or_default();

        state
            .sse_broker
            .broadcast(
                gid,
                SseEvent::TilesPlayed {
                    player_id: pid,
                    points,
                    tiles: board_tiles,
                },
            )
            .await;
        state
            .sse_broker
            .broadcast(
                gid,
                SseEvent::TurnChanged {
                    player_id: next_pid,
                    pseudo: next_pseudo,
                },
            )
            .await;

        // Auto-play bot if next player is bot
        if state.repo.is_bot(next_pid).await? {
            auto_play_bot(state.clone(), gid, next_pid).await?;
        }
    }

    Ok(Json(PlayResult {
        code: "ok".to_string(),
        points,
        new_rack,
    }))
}

pub async fn simulate_play(
    State(state): State<Arc<AppState>>,
    AuthUser(user_id): AuthUser,
    Path(game_id): Path<i64>,
    Json(placements): Json<Vec<TilePlacement>>,
) -> Result<Json<SimulationResult>, AppError> {
    let gid = GameId(game_id);
    let game = state.repo.get_game(gid).await?;

    let player = game
        .players
        .iter()
        .find(|p| p.user_id == user_id)
        .ok_or_else(|| AppError::NotFound("player not in game".to_string()))?;

    let board_tiles: Vec<BoardTile> = placements
        .iter()
        .map(|p| BoardTile {
            face: p.tile,
            coordinate: p.coordinate,
        })
        .collect();

    // Check player has all tiles
    for bt in &board_tiles {
        if !player.rack.iter().any(|r| r.face == bt.face) {
            return Err(GameError::PlayerDoesntHaveTile(bt.face).into());
        }
    }

    match validate_and_score(&game.board, &board_tiles) {
        Ok(points) => Ok(Json(SimulationResult {
            code: "ok".to_string(),
            points,
        })),
        Err(e) => Ok(Json(SimulationResult {
            code: format!("{e}"),
            points: 0,
        })),
    }
}

pub async fn swap_tiles(
    State(state): State<Arc<AppState>>,
    AuthUser(user_id): AuthUser,
    Path(game_id): Path<i64>,
    Json(req): Json<SwapRequest>,
) -> Result<Json<SwapResult>, AppError> {
    let gid = GameId(game_id);
    let game = state.repo.get_game(gid).await?;

    let player = game
        .players
        .iter()
        .find(|p| p.user_id == user_id)
        .ok_or_else(|| AppError::NotFound("player not in game".to_string()))?;

    if !player.is_turn {
        return Err(GameError::NotPlayerTurn.into());
    }

    let faces: Vec<TileFace> = req.tiles.iter().map(|t| *t).collect();

    // Remove tiles from rack, return to bag, draw new
    let pid = player.id;
    state.repo.remove_from_rack(pid, &faces).await?;
    state.repo.return_to_bag(gid, &faces).await?;
    let drawn = state.repo.draw_from_bag(gid, faces.len()).await?;
    let new_rack = state.repo.add_to_rack(pid, &drawn).await?;

    let next_pid = state.repo.advance_turn(gid).await?;
    let next_pseudo = state.repo.get_players(gid).await?.into_iter().find(|p| p.id == next_pid).map(|p| p.pseudo).unwrap_or_default();

    state
        .sse_broker
        .broadcast(gid, SseEvent::TilesSwapped { player_id: pid })
        .await;
    state
        .sse_broker
        .broadcast(
            gid,
            SseEvent::TurnChanged {
                player_id: next_pid,
                pseudo: next_pseudo,
            },
        )
        .await;

    if state.repo.is_bot(next_pid).await? {
        auto_play_bot(state.clone(), gid, next_pid).await?;
    }

    Ok(Json(SwapResult { new_rack }))
}

pub async fn skip_turn(
    State(state): State<Arc<AppState>>,
    AuthUser(user_id): AuthUser,
    Path(game_id): Path<i64>,
) -> Result<axum::http::StatusCode, AppError> {
    let gid = GameId(game_id);
    let game = state.repo.get_game(gid).await?;

    let player = game
        .players
        .iter()
        .find(|p| p.user_id == user_id)
        .ok_or_else(|| AppError::NotFound("player not in game".to_string()))?;

    if !player.is_turn {
        return Err(GameError::NotPlayerTurn.into());
    }

    let next_pid = state.repo.advance_turn(gid).await?;
    let next_pseudo = state.repo.get_players(gid).await?.into_iter().find(|p| p.id == next_pid).map(|p| p.pseudo).unwrap_or_default();

    state
        .sse_broker
        .broadcast(
            gid,
            SseEvent::TurnChanged {
                player_id: next_pid,
                pseudo: next_pseudo,
            },
        )
        .await;

    if state.repo.is_bot(next_pid).await? {
        auto_play_bot(state.clone(), gid, next_pid).await?;
    }

    Ok(axum::http::StatusCode::NO_CONTENT)
}

pub async fn arrange_rack(
    State(state): State<Arc<AppState>>,
    AuthUser(user_id): AuthUser,
    Path(game_id): Path<i64>,
    Json(req): Json<ArrangeRackRequest>,
) -> Result<Json<Vec<RackTile>>, AppError> {
    let gid = GameId(game_id);
    let game = state.repo.get_game(gid).await?;

    let player = game
        .players
        .iter()
        .find(|p| p.user_id == user_id)
        .ok_or_else(|| AppError::NotFound("player not in game".to_string()))?;

    let tiles: Vec<RackTile> = req
        .tiles
        .iter()
        .map(|t| RackTile {
            face: t.tile,
            rack_position: t.rack_position,
        })
        .collect();

    state.repo.set_rack_order(player.id, &tiles).await?;
    let rack = state.repo.get_rack(player.id).await?;
    Ok(Json(rack))
}

pub async fn ai_best_moves(
    State(state): State<Arc<AppState>>,
    AuthUser(_user_id): AuthUser,
    Path(game_id): Path<i64>,
) -> Result<Json<Vec<AiMove>>, AppError> {
    let gid = GameId(game_id);
    let game = state.repo.get_game(gid).await?;

    let current = game
        .players
        .iter()
        .find(|p| p.is_turn)
        .ok_or_else(|| AppError::NotFound("no current player".to_string()))?;

    let moves = ai::best_moves(&game.board, &current.rack);
    Ok(Json(
        moves
            .into_iter()
            .map(|m| AiMove {
                tiles: m.tiles,
                score: m.score,
            })
            .collect(),
    ))
}

/// Public entry point: trigger a bot's turn (used by spectate games).
pub async fn auto_play_bot_public(
    state: Arc<AppState>,
    game_id: GameId,
    bot_player_id: crate::domain::player::PlayerId,
) -> Result<(), AppError> {
    auto_play_bot(state, game_id, bot_player_id).await
}

/// Auto-play a bot's turn.
async fn auto_play_bot(
    state: Arc<AppState>,
    game_id: GameId,
    bot_player_id: crate::domain::player::PlayerId,
) -> Result<(), AppError> {
    let game = state.repo.get_game(game_id).await?;
    let bot = game
        .players
        .iter()
        .find(|p| p.id == bot_player_id)
        .ok_or_else(|| AppError::Internal("bot player not found".to_string()))?;

    // Dispatch on bot kind
    let bot_move = match bot_kind_from_pseudo(&bot.pseudo) {
        BotKind::NeuralMcts => {
            let opp = game.players.iter().find(|p| p.id != bot_player_id);
            let opp_score = opp.map(|p| p.points).unwrap_or(0);
            let bag_size = game.bag.len();
            let rack_faces: Vec<TileFace> = bot.rack.iter().map(|r| r.face).collect();
            let board_clone = game.board.clone();
            let rack_clone = bot.rack.clone();
            let bot_score = bot.points;

            // Run MCTS in blocking thread to not stall the tokio runtime
            // (MCTS does CPU-intensive NN forward passes)
            let mcts_result = tokio::task::spawn_blocking(move || {
                mcts_best_move(
                    &board_clone,
                    &rack_faces,
                    bag_size,
                    bot_score,
                    opp_score,
                    DEFAULT_MCTS_SIMS,
                )
            })
            .await
            .ok()
            .flatten();

            mcts_result.or_else(|| ai::best_moves(&game.board, &rack_clone).into_iter().next())
        }
        BotKind::Greedy => ai::best_moves(&game.board, &bot.rack).into_iter().next(),
    };

    if let Some(best) = bot_move {
        let played_faces: Vec<TileFace> = best.tiles.iter().map(|t| t.face).collect();

        state
            .repo
            .place_tiles(game_id, bot_player_id, &best.tiles)
            .await?;
        state
            .repo
            .remove_from_rack(bot_player_id, &played_faces)
            .await?;
        let drawn = state
            .repo
            .draw_from_bag(game_id, played_faces.len())
            .await?;
        state.repo.add_to_rack(bot_player_id, &drawn).await?;
        state
            .repo
            .update_player_score(bot_player_id, best.score)
            .await?;

        state
            .sse_broker
            .broadcast(
                game_id,
                SseEvent::TilesPlayed {
                    player_id: bot_player_id,
                    points: best.score,
                    tiles: best.tiles.clone(),
                },
            )
            .await;

        // Check game over
        let bag = state.repo.get_bag_tiles(game_id).await?;
        let rack = state.repo.get_rack(bot_player_id).await?;
        if rack.is_empty() && bag.is_empty() {
            state
                .repo
                .set_game_status(game_id, GameStatus::Finished)
                .await?;
            let players = state.repo.get_players(game_id).await?;
            let max = players.iter().map(|p| p.points).max().unwrap_or(0);
            let winners = players.iter().filter(|p| p.points == max).map(|p| p.id).collect();
            state
                .sse_broker
                .broadcast(game_id, SseEvent::GameOver { winner_ids: winners })
                .await;
        } else {
            let next_pid = state.repo.advance_turn(game_id).await?;
            let next_pseudo = state.repo.get_players(game_id).await?.into_iter().find(|p| p.id == next_pid).map(|p| p.pseudo).unwrap_or_default();
            state
                .sse_broker
                .broadcast(
                    game_id,
                    SseEvent::TurnChanged {
                        player_id: next_pid,
                        pseudo: next_pseudo,
                    },
                )
                .await;

            // Chain bot turns
            if state.repo.is_bot(next_pid).await? {
                Box::pin(auto_play_bot(state, game_id, next_pid)).await?;
            }
        }
    } else {
        // Bot can't play, swap random tiles
        let swap_count = bot.rack.len().min(3);
        if swap_count > 0 {
            let faces: Vec<TileFace> = bot.rack.iter().take(swap_count).map(|r| r.face).collect();
            state
                .repo
                .remove_from_rack(bot_player_id, &faces)
                .await?;
            state.repo.return_to_bag(game_id, &faces).await?;
            let drawn = state.repo.draw_from_bag(game_id, swap_count).await?;
            state.repo.add_to_rack(bot_player_id, &drawn).await?;

            state
                .sse_broker
                .broadcast(
                    game_id,
                    SseEvent::TilesSwapped {
                        player_id: bot_player_id,
                    },
                )
                .await;
        }

        let next_pid = state.repo.advance_turn(game_id).await?;
        let next_pseudo = state.repo.get_players(game_id).await?.into_iter().find(|p| p.id == next_pid).map(|p| p.pseudo).unwrap_or_default();
        state
            .sse_broker
            .broadcast(
                game_id,
                SseEvent::TurnChanged {
                    player_id: next_pid,
                    pseudo: next_pseudo,
                },
            )
            .await;

        if state.repo.is_bot(next_pid).await? {
            Box::pin(auto_play_bot(state, game_id, next_pid)).await?;
        }
    }

    Ok(())
}
