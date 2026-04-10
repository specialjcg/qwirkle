//! Tile types for board, rack, and bag.

use serde::{Deserialize, Serialize};

use super::color::Color;
use super::shape::Shape;

/// The face of a tile: a color/shape combination.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize)]
pub struct TileFace {
    pub color: Color,
    pub shape: Shape,
}

/// A position on the board grid.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize)]
pub struct Coordinate {
    pub x: i32,
    pub y: i32,
}

/// A tile placed on the board.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub struct BoardTile {
    pub face: TileFace,
    pub coordinate: Coordinate,
}

/// A tile in a player's rack.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub struct RackTile {
    pub face: TileFace,
    pub rack_position: u8,
}

/// Direction for row traversal.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Direction {
    Horizontal,
    Vertical,
}

impl TileFace {
    /// Generate the full bag of 108 tiles (3 copies of each color/shape combo).
    pub fn full_bag() -> Vec<TileFace> {
        let mut bag = Vec::with_capacity(108);
        for &color in &Color::ALL {
            for &shape in &Shape::ALL {
                for _ in 0..3 {
                    bag.push(TileFace { color, shape });
                }
            }
        }
        bag
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::domain::color::Color;
    use crate::domain::shape::Shape;
    use std::collections::HashMap;

    #[test]
    fn full_bag_has_108_tiles() {
        let bag = TileFace::full_bag();
        assert_eq!(bag.len(), 108);
    }

    #[test]
    fn full_bag_has_3_of_each_combo() {
        let bag = TileFace::full_bag();
        let mut counts: HashMap<(u8, u8), usize> = HashMap::new();
        for face in &bag {
            *counts.entry((face.color as u8, face.shape as u8)).or_default() += 1;
        }
        // 6 colors * 6 shapes = 36 combos, each with count 3
        assert_eq!(counts.len(), 36);
        for &count in counts.values() {
            assert_eq!(count, 3);
        }
    }

    #[test]
    fn coordinate_equality() {
        let a = Coordinate { x: 3, y: -2 };
        let b = Coordinate { x: 3, y: -2 };
        let c = Coordinate { x: 3, y: 0 };
        assert_eq!(a, b);
        assert_ne!(a, c);
    }

    #[test]
    fn tile_face_equality() {
        let a = TileFace { color: Color::Red, shape: Shape::Circle };
        let b = TileFace { color: Color::Red, shape: Shape::Circle };
        let c = TileFace { color: Color::Red, shape: Shape::Square };
        assert_eq!(a, b);
        assert_ne!(a, c);
    }
}
