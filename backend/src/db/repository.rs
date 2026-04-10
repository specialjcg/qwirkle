//! Database repository for all CRUD operations.

use rand::seq::SliceRandom;
use sqlx::SqlitePool;

use crate::domain::color::Color;
use crate::domain::error::AppError;
use crate::domain::game::{GameId, GameInternal, GameStatus};
use crate::domain::player::{Player, PlayerId, UserId};
use crate::domain::shape::Shape;
use crate::domain::tile::{BoardTile, Coordinate, RackTile, TileFace};

/// Number of tiles dealt to each player at game start.
const INITIAL_RACK_SIZE: usize = 6;

/// Database access layer.
#[derive(Debug, Clone)]
pub struct Repository {
    pool: SqlitePool,
}

impl Repository {
    pub fn new(pool: SqlitePool) -> Self {
        Self { pool }
    }

    // ── Users ──

    pub async fn create_user(
        &self,
        pseudo: &str,
        email: Option<&str>,
        first_name: Option<&str>,
        last_name: Option<&str>,
        password_hash: &str,
        is_guest: bool,
    ) -> Result<UserId, AppError> {
        let id = sqlx::query_scalar(
            "INSERT INTO users (pseudo, email, first_name, last_name, password_hash, is_guest) VALUES (?, ?, ?, ?, ?, ?) RETURNING id",
        )
        .bind(pseudo)
        .bind(email)
        .bind(first_name)
        .bind(last_name)
        .bind(password_hash)
        .bind(is_guest)
        .fetch_one(&self.pool)
        .await?;
        Ok(UserId(id))
    }

    pub async fn get_user_by_pseudo(
        &self,
        pseudo: &str,
    ) -> Result<Option<(UserId, String)>, AppError> {
        let row: Option<(i64, String)> =
            sqlx::query_as("SELECT id, password_hash FROM users WHERE pseudo = ?")
                .bind(pseudo)
                .fetch_optional(&self.pool)
                .await?;
        Ok(row.map(|(id, hash)| (UserId(id), hash)))
    }

    pub async fn get_user_pseudo(&self, user_id: UserId) -> Result<String, AppError> {
        let pseudo: String =
            sqlx::query_scalar("SELECT pseudo FROM users WHERE id = ?")
                .bind(user_id.0)
                .fetch_one(&self.pool)
                .await?;
        Ok(pseudo)
    }

    // ── Games ──

    pub async fn create_game(&self) -> Result<GameId, AppError> {
        let id: i64 = sqlx::query_scalar(
            "INSERT INTO games (status) VALUES ('in_progress') RETURNING id",
        )
        .fetch_one(&self.pool)
        .await?;
        Ok(GameId(id))
    }

    pub async fn create_spectate_game(&self, spectator_user_id: UserId) -> Result<GameId, AppError> {
        let id: i64 = sqlx::query_scalar(
            "INSERT INTO games (status, spectator_user_id) VALUES ('in_progress', ?) RETURNING id",
        )
        .bind(spectator_user_id.0)
        .fetch_one(&self.pool)
        .await?;
        Ok(GameId(id))
    }

    pub async fn get_user_game_ids(&self, user_id: UserId) -> Result<Vec<GameId>, AppError> {
        let rows: Vec<(i64,)> = sqlx::query_as(
            "SELECT DISTINCT g.id FROM games g \
             LEFT JOIN players p ON g.id = p.game_id \
             WHERE p.user_id = ? OR g.spectator_user_id = ? \
             ORDER BY g.id DESC",
        )
        .bind(user_id.0)
        .bind(user_id.0)
        .fetch_all(&self.pool)
        .await?;
        Ok(rows.into_iter().map(|(id,)| GameId(id)).collect())
    }

    pub async fn get_game(&self, game_id: GameId) -> Result<GameInternal, AppError> {
        let status_str: String =
            sqlx::query_scalar("SELECT status FROM games WHERE id = ?")
                .bind(game_id.0)
                .fetch_optional(&self.pool)
                .await?
                .ok_or_else(|| AppError::NotFound(format!("game {}", game_id.0)))?;

        let status = match status_str.as_str() {
            "waiting" => GameStatus::Waiting,
            "in_progress" => GameStatus::InProgress,
            "finished" => GameStatus::Finished,
            _ => GameStatus::InProgress,
        };

        let board = self.get_board_tiles(game_id).await?;
        let players = self.get_players(game_id).await?;
        let bag = self.get_bag_tiles(game_id).await?;

        Ok(GameInternal {
            id: game_id,
            board,
            players,
            bag,
            status,
        })
    }

    pub async fn delete_game(&self, game_id: GameId) -> Result<(), AppError> {
        // Get player IDs for rack cleanup
        let player_ids: Vec<(i64,)> =
            sqlx::query_as("SELECT id FROM players WHERE game_id = ?")
                .bind(game_id.0)
                .fetch_all(&self.pool)
                .await?;

        for (pid,) in &player_ids {
            sqlx::query("DELETE FROM rack_tiles WHERE player_id = ?")
                .bind(pid)
                .execute(&self.pool)
                .await?;
        }

        sqlx::query("DELETE FROM board_tiles WHERE game_id = ?")
            .bind(game_id.0)
            .execute(&self.pool)
            .await?;

        sqlx::query("DELETE FROM bag_tiles WHERE game_id = ?")
            .bind(game_id.0)
            .execute(&self.pool)
            .await?;

        sqlx::query("DELETE FROM players WHERE game_id = ?")
            .bind(game_id.0)
            .execute(&self.pool)
            .await?;

        sqlx::query("DELETE FROM games WHERE id = ?")
            .bind(game_id.0)
            .execute(&self.pool)
            .await?;

        Ok(())
    }

    pub async fn set_game_status(
        &self,
        game_id: GameId,
        status: GameStatus,
    ) -> Result<(), AppError> {
        let s = match status {
            GameStatus::Waiting => "waiting",
            GameStatus::InProgress => "in_progress",
            GameStatus::Finished => "finished",
        };
        sqlx::query("UPDATE games SET status = ? WHERE id = ?")
            .bind(s)
            .bind(game_id.0)
            .execute(&self.pool)
            .await?;
        Ok(())
    }

    // ── Players ──

    pub async fn add_player(
        &self,
        user_id: UserId,
        game_id: GameId,
        position: u8,
        is_turn: bool,
        is_bot: bool,
    ) -> Result<PlayerId, AppError> {
        let id: i64 = sqlx::query_scalar(
            "INSERT INTO players (user_id, game_id, game_position, is_turn, is_bot) VALUES (?, ?, ?, ?, ?) RETURNING id",
        )
        .bind(user_id.0)
        .bind(game_id.0)
        .bind(position)
        .bind(is_turn)
        .bind(is_bot)
        .fetch_one(&self.pool)
        .await?;
        Ok(PlayerId(id))
    }

    pub async fn get_players(&self, game_id: GameId) -> Result<Vec<Player>, AppError> {
        let rows: Vec<(i64, String, i64, i32, i32, i32, bool)> = sqlx::query_as(
            "SELECT p.id, u.pseudo, p.user_id, p.game_position, p.points, p.last_turn_points, p.is_turn \
             FROM players p JOIN users u ON p.user_id = u.id WHERE p.game_id = ? ORDER BY p.game_position",
        )
        .bind(game_id.0)
        .fetch_all(&self.pool)
        .await?;

        let mut players = Vec::with_capacity(rows.len());
        for (id, pseudo, user_id, pos, pts, ltp, is_turn) in rows {
            let rack = self.get_rack(PlayerId(id)).await?;
            players.push(Player {
                id: PlayerId(id),
                pseudo,
                user_id: UserId(user_id),
                game_id,
                game_position: pos as u8,
                points: pts,
                last_turn_points: ltp,
                rack,
                is_turn,
            });
        }
        Ok(players)
    }

    pub async fn get_current_turn_player(
        &self,
        game_id: GameId,
    ) -> Result<Option<Player>, AppError> {
        let players = self.get_players(game_id).await?;
        Ok(players.into_iter().find(|p| p.is_turn))
    }

    pub async fn advance_turn(&self, game_id: GameId) -> Result<PlayerId, AppError> {
        let players = self.get_players(game_id).await?;
        let current_idx = players.iter().position(|p| p.is_turn).unwrap_or(0);
        let next_idx = (current_idx + 1) % players.len();

        // Clear all turns
        sqlx::query("UPDATE players SET is_turn = 0 WHERE game_id = ?")
            .bind(game_id.0)
            .execute(&self.pool)
            .await?;

        // Set next player's turn
        let next_id = players[next_idx].id;
        sqlx::query("UPDATE players SET is_turn = 1 WHERE id = ?")
            .bind(next_id.0)
            .execute(&self.pool)
            .await?;

        Ok(next_id)
    }

    pub async fn update_player_score(
        &self,
        player_id: PlayerId,
        points: i32,
    ) -> Result<(), AppError> {
        sqlx::query(
            "UPDATE players SET points = points + ?, last_turn_points = ? WHERE id = ?",
        )
        .bind(points)
        .bind(points)
        .bind(player_id.0)
        .execute(&self.pool)
        .await?;
        Ok(())
    }

    // ── Board Tiles ──

    pub async fn get_board_tiles(&self, game_id: GameId) -> Result<Vec<BoardTile>, AppError> {
        let rows: Vec<(i32, i32, i32, i32)> =
            sqlx::query_as("SELECT color, shape, x, y FROM board_tiles WHERE game_id = ?")
                .bind(game_id.0)
                .fetch_all(&self.pool)
                .await?;

        Ok(rows
            .into_iter()
            .map(|(c, s, x, y)| BoardTile {
                face: TileFace {
                    color: int_to_color(c),
                    shape: int_to_shape(s),
                },
                coordinate: Coordinate { x, y },
            })
            .collect())
    }

    pub async fn place_tiles(
        &self,
        game_id: GameId,
        player_id: PlayerId,
        tiles: &[BoardTile],
    ) -> Result<(), AppError> {
        for tile in tiles {
            sqlx::query(
                "INSERT INTO board_tiles (game_id, color, shape, x, y, played_by) VALUES (?, ?, ?, ?, ?, ?)",
            )
            .bind(game_id.0)
            .bind(tile.face.color as i32)
            .bind(tile.face.shape as i32)
            .bind(tile.coordinate.x)
            .bind(tile.coordinate.y)
            .bind(player_id.0)
            .execute(&self.pool)
            .await?;
        }
        Ok(())
    }

    // ── Rack ──

    pub async fn get_rack(&self, player_id: PlayerId) -> Result<Vec<RackTile>, AppError> {
        let rows: Vec<(i32, i32, i32)> =
            sqlx::query_as("SELECT color, shape, rack_position FROM rack_tiles WHERE player_id = ? ORDER BY rack_position")
                .bind(player_id.0)
                .fetch_all(&self.pool)
                .await?;

        Ok(rows
            .into_iter()
            .map(|(c, s, rp)| RackTile {
                face: TileFace {
                    color: int_to_color(c),
                    shape: int_to_shape(s),
                },
                rack_position: rp as u8,
            })
            .collect())
    }

    pub async fn remove_from_rack(
        &self,
        player_id: PlayerId,
        faces: &[TileFace],
    ) -> Result<(), AppError> {
        for face in faces {
            sqlx::query(
                "DELETE FROM rack_tiles WHERE id IN (SELECT id FROM rack_tiles WHERE player_id = ? AND color = ? AND shape = ? LIMIT 1)",
            )
            .bind(player_id.0)
            .bind(face.color as i32)
            .bind(face.shape as i32)
            .execute(&self.pool)
            .await?;
        }
        Ok(())
    }

    pub async fn add_to_rack(
        &self,
        player_id: PlayerId,
        tiles: &[TileFace],
    ) -> Result<Vec<RackTile>, AppError> {
        let existing = self.get_rack(player_id).await?;
        let mut pos = existing.last().map_or(0, |t| t.rack_position + 1);

        for face in tiles {
            sqlx::query(
                "INSERT INTO rack_tiles (player_id, color, shape, rack_position) VALUES (?, ?, ?, ?)",
            )
            .bind(player_id.0)
            .bind(face.color as i32)
            .bind(face.shape as i32)
            .bind(pos)
            .execute(&self.pool)
            .await?;
            pos += 1;
        }

        self.get_rack(player_id).await
    }

    pub async fn set_rack_order(
        &self,
        player_id: PlayerId,
        tiles: &[RackTile],
    ) -> Result<(), AppError> {
        sqlx::query("DELETE FROM rack_tiles WHERE player_id = ?")
            .bind(player_id.0)
            .execute(&self.pool)
            .await?;

        for tile in tiles {
            sqlx::query(
                "INSERT INTO rack_tiles (player_id, color, shape, rack_position) VALUES (?, ?, ?, ?)",
            )
            .bind(player_id.0)
            .bind(tile.face.color as i32)
            .bind(tile.face.shape as i32)
            .bind(tile.rack_position)
            .execute(&self.pool)
            .await?;
        }
        Ok(())
    }

    // ── Bag ──

    pub async fn get_bag_tiles(&self, game_id: GameId) -> Result<Vec<TileFace>, AppError> {
        let rows: Vec<(i32, i32)> =
            sqlx::query_as("SELECT color, shape FROM bag_tiles WHERE game_id = ?")
                .bind(game_id.0)
                .fetch_all(&self.pool)
                .await?;

        Ok(rows
            .into_iter()
            .map(|(c, s)| TileFace {
                color: int_to_color(c),
                shape: int_to_shape(s),
            })
            .collect())
    }

    pub async fn fill_bag(&self, game_id: GameId, tiles: &[TileFace]) -> Result<(), AppError> {
        for face in tiles {
            sqlx::query("INSERT INTO bag_tiles (game_id, color, shape) VALUES (?, ?, ?)")
                .bind(game_id.0)
                .bind(face.color as i32)
                .bind(face.shape as i32)
                .execute(&self.pool)
                .await?;
        }
        Ok(())
    }

    /// Draw N random tiles from the bag. Returns the drawn tiles.
    pub async fn draw_from_bag(
        &self,
        game_id: GameId,
        count: usize,
    ) -> Result<Vec<TileFace>, AppError> {
        // Get bag tile IDs to delete specific ones
        let mut rows: Vec<(i64, i32, i32)> =
            sqlx::query_as("SELECT id, color, shape FROM bag_tiles WHERE game_id = ?")
                .bind(game_id.0)
                .fetch_all(&self.pool)
                .await?;

        {
            let mut rng = rand::thread_rng();
            rows.shuffle(&mut rng);
        }

        let draw_count = count.min(rows.len());
        let mut drawn = Vec::with_capacity(draw_count);

        for row in rows.iter().take(draw_count) {
            sqlx::query("DELETE FROM bag_tiles WHERE id = ?")
                .bind(row.0)
                .execute(&self.pool)
                .await?;
            drawn.push(TileFace {
                color: int_to_color(row.1),
                shape: int_to_shape(row.2),
            });
        }

        Ok(drawn)
    }

    pub async fn return_to_bag(
        &self,
        game_id: GameId,
        tiles: &[TileFace],
    ) -> Result<(), AppError> {
        self.fill_bag(game_id, tiles).await
    }

    // ── Game initialization ──

    /// Initialize a full game: create bag, deal tiles to players.
    pub async fn initialize_game(
        &self,
        game_id: GameId,
        player_ids: &[PlayerId],
    ) -> Result<(), AppError> {
        let mut bag = TileFace::full_bag();
        {
            let mut rng = rand::thread_rng();
            bag.shuffle(&mut rng);
        }

        // Deal to each player
        for &pid in player_ids {
            let hand_size = INITIAL_RACK_SIZE.min(bag.len());
            let hand: Vec<TileFace> = bag.drain(..hand_size).collect();
            for (pos, face) in hand.iter().enumerate() {
                sqlx::query(
                    "INSERT INTO rack_tiles (player_id, color, shape, rack_position) VALUES (?, ?, ?, ?)",
                )
                .bind(pid.0)
                .bind(face.color as i32)
                .bind(face.shape as i32)
                .bind(pos as i32)
                .execute(&self.pool)
                .await?;
            }
        }

        // Remaining tiles go to bag
        self.fill_bag(game_id, &bag).await?;
        Ok(())
    }

    // ── Bookmarked opponents ──

    pub async fn get_bookmarked_opponents(
        &self,
        user_id: UserId,
    ) -> Result<Vec<String>, AppError> {
        let rows: Vec<(String,)> =
            sqlx::query_as("SELECT opponent_name FROM bookmarked_opponents WHERE user_id = ?")
                .bind(user_id.0)
                .fetch_all(&self.pool)
                .await?;
        Ok(rows.into_iter().map(|(n,)| n).collect())
    }

    pub async fn add_bookmarked_opponent(
        &self,
        user_id: UserId,
        name: &str,
    ) -> Result<(), AppError> {
        sqlx::query(
            "INSERT OR IGNORE INTO bookmarked_opponents (user_id, opponent_name) VALUES (?, ?)",
        )
        .bind(user_id.0)
        .bind(name)
        .execute(&self.pool)
        .await?;
        Ok(())
    }

    // ── Instant game queue ──

    pub async fn join_instant_queue(
        &self,
        user_id: UserId,
        players_needed: u8,
    ) -> Result<Vec<UserId>, AppError> {
        sqlx::query("INSERT INTO instant_game_queue (user_id, players_needed) VALUES (?, ?)")
            .bind(user_id.0)
            .bind(players_needed)
            .execute(&self.pool)
            .await?;

        let rows: Vec<(i64,)> = sqlx::query_as(
            "SELECT user_id FROM instant_game_queue WHERE players_needed = ? ORDER BY created_at",
        )
        .bind(players_needed)
        .fetch_all(&self.pool)
        .await?;

        let waiting: Vec<UserId> = rows.into_iter().map(|(id,)| UserId(id)).collect();

        if waiting.len() >= players_needed as usize {
            // Remove matched players from queue
            let matched: Vec<UserId> = waiting.into_iter().take(players_needed as usize).collect();
            for uid in &matched {
                sqlx::query("DELETE FROM instant_game_queue WHERE user_id = ?")
                    .bind(uid.0)
                    .execute(&self.pool)
                    .await?;
            }
            Ok(matched)
        } else {
            Ok(vec![])
        }
    }

    // ── Utility: check if player is bot ──

    pub async fn is_bot(&self, player_id: PlayerId) -> Result<bool, AppError> {
        let is_bot: bool =
            sqlx::query_scalar("SELECT is_bot FROM players WHERE id = ?")
                .bind(player_id.0)
                .fetch_one(&self.pool)
                .await?;
        Ok(is_bot)
    }

    /// Get or create a bot user, returning its UserId.
    pub async fn get_or_create_bot_user(&self, bot_name: &str) -> Result<UserId, AppError> {
        if let Some((id, _)) = self.get_user_by_pseudo(bot_name).await? {
            return Ok(id);
        }
        self.create_user(bot_name, None, None, None, "bot-no-login", true)
            .await
    }

    /// Run migrations (execute each statement separately for SQLite compatibility).
    pub async fn migrate(&self) -> Result<(), AppError> {
        let sql = include_str!("../../migrations/001_initial.sql");
        for statement in sql.split(';') {
            let trimmed = statement.trim();
            if !trimmed.is_empty() {
                sqlx::query(trimmed)
                    .execute(&self.pool)
                    .await
                    .ok(); // Ignore if table already exists
            }
        }
        Ok(())
    }
}

fn int_to_color(v: i32) -> Color {
    match v {
        1 => Color::Green,
        2 => Color::Blue,
        3 => Color::Purple,
        4 => Color::Red,
        5 => Color::Orange,
        6 => Color::Yellow,
        _ => Color::Green,
    }
}

fn int_to_shape(v: i32) -> Shape {
    match v {
        1 => Shape::Circle,
        2 => Shape::Square,
        3 => Shape::Diamond,
        4 => Shape::Clover,
        5 => Shape::FourPointStar,
        6 => Shape::EightPointStar,
        _ => Shape::Circle,
    }
}
