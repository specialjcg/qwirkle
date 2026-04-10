//! Bot AI: finds the best valid move for a player.

use super::rules::validate_and_score;
use super::tile::{BoardTile, Coordinate, RackTile};

/// A scored move candidate.
#[derive(Debug, Clone)]
pub struct ScoredMove {
    pub tiles: Vec<BoardTile>,
    pub score: i32,
}

/// Find all valid single-tile placements and return them sorted by score descending.
///
/// For simplicity, this AI tries all single-tile and multi-tile (same-line) placements
/// from the player's rack. Returns top moves.
pub fn best_moves(board: &[BoardTile], rack: &[RackTile]) -> Vec<ScoredMove> {
    let candidates = candidate_positions(board);
    let mut moves: Vec<ScoredMove> = Vec::new();

    // Try single-tile placements
    for rack_tile in rack {
        for &coord in &candidates {
            let placement = vec![BoardTile {
                face: rack_tile.face,
                coordinate: coord,
            }];
            if let Ok(score) = validate_and_score(board, &placement) {
                moves.push(ScoredMove {
                    tiles: placement,
                    score,
                });
            }
        }
    }

    // Try two-tile placements (same row/column)
    if rack.len() >= 2 {
        for i in 0..rack.len() {
            for j in (i + 1)..rack.len() {
                for &c1 in &candidates {
                    // Try horizontal neighbor
                    for &c2 in &candidates {
                        if c1 == c2 {
                            continue;
                        }
                        if (c1.x == c2.x && (c1.y - c2.y).abs() <= 2)
                            || (c1.y == c2.y && (c1.x - c2.x).abs() <= 2)
                        {
                            let placement = vec![
                                BoardTile {
                                    face: rack[i].face,
                                    coordinate: c1,
                                },
                                BoardTile {
                                    face: rack[j].face,
                                    coordinate: c2,
                                },
                            ];
                            if let Ok(score) = validate_and_score(board, &placement) {
                                moves.push(ScoredMove {
                                    tiles: placement,
                                    score,
                                });
                            }
                        }
                    }
                }
            }
        }
    }

    moves.sort_by(|a, b| b.score.cmp(&a.score));
    moves.truncate(10);
    moves
}

/// Generate candidate positions: all empty cells adjacent to existing board tiles.
fn candidate_positions(board: &[BoardTile]) -> Vec<Coordinate> {
    use std::collections::HashSet;

    if board.is_empty() {
        return vec![Coordinate { x: 0, y: 0 }];
    }

    let occupied: HashSet<Coordinate> = board.iter().map(|t| t.coordinate).collect();
    let mut candidates: HashSet<Coordinate> = HashSet::new();

    for tile in board {
        let c = tile.coordinate;
        for neighbor in [
            Coordinate { x: c.x + 1, y: c.y },
            Coordinate { x: c.x - 1, y: c.y },
            Coordinate { x: c.x, y: c.y + 1 },
            Coordinate { x: c.x, y: c.y - 1 },
        ] {
            if !occupied.contains(&neighbor) {
                candidates.insert(neighbor);
            }
        }
    }

    candidates.into_iter().collect()
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::domain::color::Color;
    use crate::domain::shape::Shape;
    use crate::domain::tile::TileFace;

    fn bt(color: Color, shape: Shape, x: i32, y: i32) -> BoardTile {
        BoardTile {
            face: TileFace { color, shape },
            coordinate: Coordinate { x, y },
        }
    }

    fn rt(color: Color, shape: Shape, pos: u8) -> RackTile {
        RackTile {
            face: TileFace { color, shape },
            rack_position: pos,
        }
    }

    #[test]
    fn empty_board_suggests_origin() {
        let rack = vec![rt(Color::Red, Shape::Circle, 0)];
        let moves = best_moves(&[], &rack);
        assert!(!moves.is_empty());
        assert!(moves[0].tiles[0].coordinate == Coordinate { x: 0, y: 0 });
    }

    #[test]
    fn finds_valid_move_adjacent() {
        let board = vec![bt(Color::Red, Shape::Circle, 0, 0)];
        let rack = vec![
            rt(Color::Red, Shape::Square, 0),
            rt(Color::Blue, Shape::Diamond, 1),
        ];
        let moves = best_moves(&board, &rack);
        assert!(!moves.is_empty());
        // All moves should be valid (adjacent to existing tile)
        for m in &moves {
            for t in &m.tiles {
                let c = t.coordinate;
                let adjacent = board.iter().any(|b| {
                    (b.coordinate.x - c.x).abs() + (b.coordinate.y - c.y).abs() <= 2
                });
                assert!(adjacent, "Move tile at ({}, {}) should be near board", c.x, c.y);
            }
        }
    }

    #[test]
    fn moves_sorted_by_score_desc() {
        let board = vec![bt(Color::Red, Shape::Circle, 0, 0)];
        let rack = vec![
            rt(Color::Red, Shape::Square, 0),
            rt(Color::Red, Shape::Diamond, 1),
            rt(Color::Blue, Shape::Circle, 2),
        ];
        let moves = best_moves(&board, &rack);
        for window in moves.windows(2) {
            assert!(window[0].score >= window[1].score);
        }
    }

    #[test]
    fn no_moves_with_incompatible_rack() {
        // Board has Red Circle; rack has only Red Circle (duplicate → invalid)
        let board = vec![bt(Color::Red, Shape::Circle, 0, 0)];
        let rack = vec![rt(Color::Red, Shape::Circle, 0)];
        let moves = best_moves(&board, &rack);
        // All single-tile placements next to Red Circle with another Red Circle
        // would create duplicate in row → should be empty
        assert!(moves.is_empty());
    }

    #[test]
    fn empty_rack_no_moves() {
        let board = vec![bt(Color::Red, Shape::Circle, 0, 0)];
        let moves = best_moves(&board, &[]);
        assert!(moves.is_empty());
    }
}
