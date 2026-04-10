CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pseudo TEXT NOT NULL UNIQUE,
    email TEXT,
    first_name TEXT,
    last_name TEXT,
    password_hash TEXT NOT NULL,
    is_guest INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE games (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    status TEXT NOT NULL DEFAULT 'waiting',
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    spectator_user_id INTEGER REFERENCES users(id)
);

CREATE TABLE players (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id),
    game_id INTEGER NOT NULL REFERENCES games(id),
    game_position INTEGER NOT NULL,
    points INTEGER NOT NULL DEFAULT 0,
    last_turn_points INTEGER NOT NULL DEFAULT 0,
    is_turn INTEGER NOT NULL DEFAULT 0,
    is_bot INTEGER NOT NULL DEFAULT 0,
    UNIQUE(user_id, game_id)
);

CREATE TABLE board_tiles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    game_id INTEGER NOT NULL REFERENCES games(id),
    color INTEGER NOT NULL,
    shape INTEGER NOT NULL,
    x INTEGER NOT NULL,
    y INTEGER NOT NULL,
    played_by INTEGER REFERENCES players(id),
    UNIQUE(game_id, x, y)
);

CREATE TABLE rack_tiles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    player_id INTEGER NOT NULL REFERENCES players(id),
    color INTEGER NOT NULL,
    shape INTEGER NOT NULL,
    rack_position INTEGER NOT NULL
);

CREATE TABLE bag_tiles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    game_id INTEGER NOT NULL REFERENCES games(id),
    color INTEGER NOT NULL,
    shape INTEGER NOT NULL
);

CREATE TABLE bookmarked_opponents (
    user_id INTEGER NOT NULL REFERENCES users(id),
    opponent_name TEXT NOT NULL,
    PRIMARY KEY(user_id, opponent_name)
);

CREATE TABLE instant_game_queue (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id),
    players_needed INTEGER NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

ALTER TABLE games ADD COLUMN spectator_user_id INTEGER REFERENCES users(id);
