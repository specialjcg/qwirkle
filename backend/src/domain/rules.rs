//! Qwirkle game rules: tile placement validation and scoring.

use std::collections::{HashMap, HashSet};

use super::error::GameError;
use super::tile::{BoardTile, Coordinate, Direction, TileFace};

/// Check if a position is already occupied on the board.
pub fn is_position_free(board: &[BoardTile], coord: Coordinate) -> bool {
    !board.iter().any(|t| t.coordinate == coord)
}

/// Collect all tiles in a line through `coord` in the given direction,
/// including any tile at `coord` itself.
pub fn get_line(
    board_map: &HashMap<Coordinate, TileFace>,
    coord: Coordinate,
    direction: Direction,
) -> Vec<(Coordinate, TileFace)> {
    let (dx, dy) = match direction {
        Direction::Horizontal => (1, 0),
        Direction::Vertical => (0, 1),
    };

    let mut line = Vec::new();

    // Collect in positive direction (including coord)
    let mut x = coord.x;
    let mut y = coord.y;
    while let Some(&face) = board_map.get(&Coordinate { x, y }) {
        line.push((Coordinate { x, y }, face));
        x += dx;
        y += dy;
    }

    // Collect in negative direction (excluding coord)
    x = coord.x - dx;
    y = coord.y - dy;
    while let Some(&face) = board_map.get(&Coordinate { x, y }) {
        line.push((Coordinate { x, y }, face));
        x -= dx;
        y -= dy;
    }

    line
}

/// Validate that a line of tiles is a valid Qwirkle row:
/// - All same color with unique shapes, OR all same shape with unique colors
/// - Max 6 tiles in a line
fn validate_line(line: &[(Coordinate, TileFace)]) -> Result<(), GameError> {
    if line.len() > 6 {
        return Err(GameError::InvalidRow);
    }
    if line.len() <= 1 {
        return Ok(());
    }

    let faces: Vec<TileFace> = line.iter().map(|(_, f)| *f).collect();

    // Check for duplicate faces
    let unique: HashSet<TileFace> = faces.iter().copied().collect();
    if unique.len() != faces.len() {
        return Err(GameError::InvalidRow);
    }

    let all_same_color = faces.iter().all(|f| f.color == faces[0].color);
    let all_same_shape = faces.iter().all(|f| f.shape == faces[0].shape);

    if !all_same_color && !all_same_shape {
        return Err(GameError::InvalidRow);
    }

    Ok(())
}

/// Validate a tile placement and return the score.
///
/// # Errors
///
/// Returns `GameError` if any position is occupied, tiles are isolated,
/// don't form valid rows, or placement rules are violated.
pub fn validate_and_score(
    board: &[BoardTile],
    placements: &[BoardTile],
) -> Result<i32, GameError> {
    if placements.is_empty() {
        return Err(GameError::InvalidRow);
    }

    // Check positions are free
    for tile in placements {
        if !is_position_free(board, tile.coordinate) {
            return Err(GameError::PositionNotFree {
                x: tile.coordinate.x,
                y: tile.coordinate.y,
            });
        }
    }

    // Build combined board map
    let mut board_map: HashMap<Coordinate, TileFace> =
        board.iter().map(|t| (t.coordinate, t.face)).collect();
    for tile in placements {
        board_map.insert(tile.coordinate, tile.face);
    }

    // First move: must go through origin
    if board.is_empty() {
        let touches_origin = placements.iter().any(|t| t.coordinate == Coordinate { x: 0, y: 0 });
        if !touches_origin {
            return Err(GameError::TileIsolated);
        }
    } else {
        // Check each placed tile is adjacent to at least one existing board tile
        let existing: HashSet<Coordinate> = board.iter().map(|t| t.coordinate).collect();
        let mut any_adjacent = false;
        for tile in placements {
            let c = tile.coordinate;
            let neighbors = [
                Coordinate { x: c.x + 1, y: c.y },
                Coordinate { x: c.x - 1, y: c.y },
                Coordinate { x: c.x, y: c.y + 1 },
                Coordinate { x: c.x, y: c.y - 1 },
            ];
            if neighbors.iter().any(|n| existing.contains(n)) {
                any_adjacent = true;
            }
        }
        if !any_adjacent {
            return Err(GameError::TileIsolated);
        }
    }

    // All placed tiles must be in the same row or column
    if placements.len() > 1 {
        let all_same_x = placements.iter().all(|t| t.coordinate.x == placements[0].coordinate.x);
        let all_same_y = placements.iter().all(|t| t.coordinate.y == placements[0].coordinate.y);
        if !all_same_x && !all_same_y {
            return Err(GameError::InvalidRow);
        }

        // Check contiguity: all placed tiles (plus any existing tiles between them)
        // must form a contiguous line with no gaps.
        if all_same_y {
            // Horizontal line: check x range
            let min_x = placements.iter().map(|t| t.coordinate.x).min().unwrap();
            let max_x = placements.iter().map(|t| t.coordinate.x).max().unwrap();
            let y = placements[0].coordinate.y;
            for x in min_x..=max_x {
                if !board_map.contains_key(&Coordinate { x, y }) {
                    return Err(GameError::InvalidRow);
                }
            }
        } else {
            // Vertical line: check y range
            let min_y = placements.iter().map(|t| t.coordinate.y).min().unwrap();
            let max_y = placements.iter().map(|t| t.coordinate.y).max().unwrap();
            let x = placements[0].coordinate.x;
            for y in min_y..=max_y {
                if !board_map.contains_key(&Coordinate { x, y }) {
                    return Err(GameError::InvalidRow);
                }
            }
        }
    }

    // Score: for each placed tile, check its horizontal and vertical lines
    let mut scored_lines: HashSet<Vec<Coordinate>> = HashSet::new();
    let mut total_score = 0;

    for tile in placements {
        for direction in [Direction::Horizontal, Direction::Vertical] {
            let line = get_line(&board_map, tile.coordinate, direction);
            if line.len() <= 1 {
                continue;
            }

            validate_line(&line)?;

            let mut coords: Vec<Coordinate> = line.iter().map(|(c, _)| *c).collect();
            coords.sort_by(|a, b| a.x.cmp(&b.x).then(a.y.cmp(&b.y)));

            if scored_lines.insert(coords) {
                let mut line_score = line.len() as i32;
                // Qwirkle bonus: completing a line of 6
                if line.len() == 6 {
                    line_score += 6;
                }
                total_score += line_score;
            }
        }
    }

    // Single tile placed adjacent to one tile (no lines formed): score 1
    if total_score == 0 {
        total_score = 1;
    }

    Ok(total_score)
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::domain::color::Color;
    use crate::domain::shape::Shape;

    fn bt(color: Color, shape: Shape, x: i32, y: i32) -> BoardTile {
        BoardTile {
            face: TileFace { color, shape },
            coordinate: Coordinate { x, y },
        }
    }

    #[test]
    fn first_tile_at_origin() {
        let board = vec![];
        let placements = vec![bt(Color::Red, Shape::Circle, 0, 0)];
        let score = validate_and_score(&board, &placements).unwrap();
        assert_eq!(score, 1);
    }

    #[test]
    fn first_tile_not_at_origin() {
        let board = vec![];
        let placements = vec![bt(Color::Red, Shape::Circle, 1, 1)];
        assert!(validate_and_score(&board, &placements).is_err());
    }

    #[test]
    fn valid_same_color_row() {
        let board = vec![bt(Color::Red, Shape::Circle, 0, 0)];
        let placements = vec![bt(Color::Red, Shape::Square, 1, 0)];
        let score = validate_and_score(&board, &placements).unwrap();
        assert_eq!(score, 2);
    }

    #[test]
    fn isolated_tile_rejected() {
        let board = vec![bt(Color::Red, Shape::Circle, 0, 0)];
        let placements = vec![bt(Color::Blue, Shape::Square, 5, 5)];
        assert!(matches!(
            validate_and_score(&board, &placements),
            Err(GameError::TileIsolated)
        ));
    }

    #[test]
    fn duplicate_face_in_row_rejected() {
        let board = vec![bt(Color::Red, Shape::Circle, 0, 0)];
        let placements = vec![bt(Color::Red, Shape::Circle, 1, 0)];
        assert!(matches!(
            validate_and_score(&board, &placements),
            Err(GameError::InvalidRow)
        ));
    }

    #[test]
    fn position_not_free() {
        let board = vec![bt(Color::Red, Shape::Circle, 0, 0)];
        let placements = vec![bt(Color::Blue, Shape::Square, 0, 0)];
        assert!(matches!(
            validate_and_score(&board, &placements),
            Err(GameError::PositionNotFree { .. })
        ));
    }

    #[test]
    fn qwirkle_bonus() {
        let board = vec![
            bt(Color::Red, Shape::Circle, 0, 0),
            bt(Color::Red, Shape::Square, 1, 0),
            bt(Color::Red, Shape::Diamond, 2, 0),
            bt(Color::Red, Shape::Clover, 3, 0),
            bt(Color::Red, Shape::FourPointStar, 4, 0),
        ];
        let placements = vec![bt(Color::Red, Shape::EightPointStar, 5, 0)];
        let score = validate_and_score(&board, &placements).unwrap();
        assert_eq!(score, 12);
    }

    #[test]
    fn valid_same_shape_row() {
        let board = vec![bt(Color::Red, Shape::Circle, 0, 0)];
        let placements = vec![bt(Color::Blue, Shape::Circle, 0, 1)];
        let score = validate_and_score(&board, &placements).unwrap();
        assert_eq!(score, 2);
    }

    #[test]
    fn mixed_color_and_shape_rejected() {
        // Red Circle + Blue Square = neither same color nor same shape
        let board = vec![bt(Color::Red, Shape::Circle, 0, 0)];
        let placements = vec![bt(Color::Blue, Shape::Square, 1, 0)];
        assert!(validate_and_score(&board, &placements).is_err());
    }

    #[test]
    fn multiple_tiles_same_turn() {
        // Place 3 red tiles in a row on empty board through origin
        let board = vec![];
        let placements = vec![
            bt(Color::Red, Shape::Circle, 0, 0),
            bt(Color::Red, Shape::Square, 1, 0),
            bt(Color::Red, Shape::Diamond, 2, 0),
        ];
        let score = validate_and_score(&board, &placements).unwrap();
        assert_eq!(score, 3);
    }

    #[test]
    fn multiple_tiles_not_in_line_rejected() {
        let board = vec![];
        let placements = vec![
            bt(Color::Red, Shape::Circle, 0, 0),
            bt(Color::Red, Shape::Square, 1, 1), // diagonal, not same row/col
        ];
        assert!(validate_and_score(&board, &placements).is_err());
    }

    #[test]
    fn cross_scoring() {
        // Board has a horizontal row, place a tile that creates a vertical line too
        let board = vec![
            bt(Color::Red, Shape::Circle, 0, 0),
            bt(Color::Red, Shape::Square, 1, 0),
            bt(Color::Blue, Shape::Diamond, 0, 1),
        ];
        // Place Blue Circle at (1,1): horizontal line (Blue Diamond + Blue Circle) = 2,
        //                             vertical line (Red Square + Blue Circle) - but different colors AND shapes... invalid
        // Instead: place Red Diamond at (1,0)... already occupied.
        // Better test: vertical extension
        let board2 = vec![
            bt(Color::Red, Shape::Circle, 0, 0),
            bt(Color::Red, Shape::Square, 1, 0),
            bt(Color::Green, Shape::Circle, 0, 1),
        ];
        // Place Green Square at (1,1): horiz = Green Circle + Green Square (same color, score 2)
        //                               vert = Red Square + Green Square (same shape, score 2)
        let placements = vec![bt(Color::Green, Shape::Square, 1, 1)];
        let score = validate_and_score(&board2, &placements).unwrap();
        assert_eq!(score, 4); // 2 horizontal + 2 vertical
    }

    #[test]
    fn seven_tiles_in_row_rejected() {
        let board = vec![
            bt(Color::Red, Shape::Circle, 0, 0),
            bt(Color::Red, Shape::Square, 1, 0),
            bt(Color::Red, Shape::Diamond, 2, 0),
            bt(Color::Red, Shape::Clover, 3, 0),
            bt(Color::Red, Shape::FourPointStar, 4, 0),
            bt(Color::Red, Shape::EightPointStar, 5, 0),
        ];
        // Try to place a 7th tile (same color) - line of 7 is invalid
        let placements = vec![bt(Color::Red, Shape::Circle, 6, 0)];
        assert!(validate_and_score(&board, &placements).is_err());
    }

    #[test]
    fn empty_placement_rejected() {
        let board = vec![bt(Color::Red, Shape::Circle, 0, 0)];
        assert!(validate_and_score(&board, &[]).is_err());
    }
}
