//! Comprehensive Qwirkle rules compliance tests.
//!
//! Based on official Qwirkle rules:
//! - 108 tiles (36 unique faces × 3 copies)
//! - 6 colors × 6 shapes
//! - Lines: max 6 tiles, all same color (unique shapes) OR all same shape (unique colors)
//! - No duplicate tile faces in a line
//! - Multi-tile placements must be in the same row/column AND contiguous
//! - Scoring: 1 point per tile in each line formed; Qwirkle (6-tile line) = 12 points
//! - First move: must include origin (0,0)
//! - End-game bonus: 6 points for emptying your hand

use qwirkle_backend::domain::color::Color;
use qwirkle_backend::domain::shape::Shape;
use qwirkle_backend::domain::rules::validate_and_score;
use qwirkle_backend::domain::tile::{BoardTile, Coordinate, TileFace};

fn bt(color: Color, shape: Shape, x: i32, y: i32) -> BoardTile {
    BoardTile {
        face: TileFace { color, shape },
        coordinate: Coordinate { x, y },
    }
}

// ════════════════════════════════════════════════════
// 1. FIRST MOVE RULES
// ════════════════════════════════════════════════════

#[test]
fn first_move_single_tile_at_origin_scores_1() {
    let score = validate_and_score(&[], &[bt(Color::Red, Shape::Circle, 0, 0)]).unwrap();
    assert_eq!(score, 1);
}

#[test]
fn first_move_not_at_origin_rejected() {
    assert!(validate_and_score(&[], &[bt(Color::Red, Shape::Circle, 1, 0)]).is_err());
}

#[test]
fn first_move_multi_tile_through_origin() {
    let placements = vec![
        bt(Color::Red, Shape::Circle, 0, 0),
        bt(Color::Red, Shape::Square, 1, 0),
        bt(Color::Red, Shape::Diamond, 2, 0),
    ];
    let score = validate_and_score(&[], &placements).unwrap();
    assert_eq!(score, 3, "First move of 3 tiles in a line scores 3");
}

#[test]
fn first_move_multi_tile_not_through_origin_rejected() {
    let placements = vec![
        bt(Color::Red, Shape::Circle, 1, 0),
        bt(Color::Red, Shape::Square, 2, 0),
    ];
    assert!(validate_and_score(&[], &placements).is_err());
}

// ════════════════════════════════════════════════════
// 2. LINE VALIDITY: SAME COLOR OR SAME SHAPE
// ════════════════════════════════════════════════════

#[test]
fn same_color_different_shapes_valid() {
    let board = vec![bt(Color::Red, Shape::Circle, 0, 0)];
    let score = validate_and_score(&board, &[bt(Color::Red, Shape::Square, 1, 0)]).unwrap();
    assert_eq!(score, 2, "Red Circle + Red Square = line of 2");
}

#[test]
fn same_shape_different_colors_valid() {
    let board = vec![bt(Color::Red, Shape::Circle, 0, 0)];
    let score = validate_and_score(&board, &[bt(Color::Blue, Shape::Circle, 0, 1)]).unwrap();
    assert_eq!(score, 2, "Red Circle + Blue Circle = line of 2");
}

#[test]
fn different_color_different_shape_rejected() {
    let board = vec![bt(Color::Red, Shape::Circle, 0, 0)];
    assert!(
        validate_and_score(&board, &[bt(Color::Blue, Shape::Square, 1, 0)]).is_err(),
        "Red Circle + Blue Square: neither same color nor same shape"
    );
}

#[test]
fn duplicate_face_in_line_rejected() {
    let board = vec![bt(Color::Red, Shape::Circle, 0, 0)];
    assert!(
        validate_and_score(&board, &[bt(Color::Red, Shape::Circle, 1, 0)]).is_err(),
        "Same tile face cannot appear twice in a line"
    );
}

// ════════════════════════════════════════════════════
// 3. MAX LINE LENGTH (6)
// ════════════════════════════════════════════════════

#[test]
fn line_of_6_is_qwirkle() {
    let board = vec![
        bt(Color::Red, Shape::Circle, 0, 0),
        bt(Color::Red, Shape::Square, 1, 0),
        bt(Color::Red, Shape::Diamond, 2, 0),
        bt(Color::Red, Shape::Clover, 3, 0),
        bt(Color::Red, Shape::FourPointStar, 4, 0),
    ];
    let score = validate_and_score(&board, &[bt(Color::Red, Shape::EightPointStar, 5, 0)]).unwrap();
    assert_eq!(score, 12, "Qwirkle: 6 + 6 bonus = 12");
}

#[test]
fn line_exceeding_6_rejected() {
    // Build a line of 6, then try to extend
    let board = vec![
        bt(Color::Red, Shape::Circle, 0, 0),
        bt(Color::Red, Shape::Square, 1, 0),
        bt(Color::Red, Shape::Diamond, 2, 0),
        bt(Color::Red, Shape::Clover, 3, 0),
        bt(Color::Red, Shape::FourPointStar, 4, 0),
        bt(Color::Red, Shape::EightPointStar, 5, 0),
    ];
    // Any tile at (6,0) would create a line > 6
    assert!(validate_and_score(&board, &[bt(Color::Red, Shape::Circle, 6, 0)]).is_err());
}

// ════════════════════════════════════════════════════
// 4. ADJACENCY: TILES MUST CONNECT TO EXISTING BOARD
// ════════════════════════════════════════════════════

#[test]
fn isolated_tile_rejected() {
    let board = vec![bt(Color::Red, Shape::Circle, 0, 0)];
    assert!(
        validate_and_score(&board, &[bt(Color::Blue, Shape::Square, 5, 5)]).is_err(),
        "Placed tile must be adjacent to at least one existing tile"
    );
}

#[test]
fn adjacent_tile_accepted() {
    let board = vec![bt(Color::Red, Shape::Circle, 0, 0)];
    assert!(validate_and_score(&board, &[bt(Color::Red, Shape::Square, 1, 0)]).is_ok());
}

#[test]
fn diagonal_not_adjacent() {
    let board = vec![bt(Color::Red, Shape::Circle, 0, 0)];
    assert!(
        validate_and_score(&board, &[bt(Color::Red, Shape::Square, 1, 1)]).is_err(),
        "Diagonal is not adjacent in Qwirkle"
    );
}

// ════════════════════════════════════════════════════
// 5. POSITION OCCUPANCY
// ════════════════════════════════════════════════════

#[test]
fn occupied_position_rejected() {
    let board = vec![bt(Color::Red, Shape::Circle, 0, 0)];
    assert!(validate_and_score(&board, &[bt(Color::Blue, Shape::Square, 0, 0)]).is_err());
}

// ════════════════════════════════════════════════════
// 6. MULTI-TILE PLACEMENT: SAME ROW OR COLUMN
// ════════════════════════════════════════════════════

#[test]
fn multi_tile_same_row_valid() {
    let board = vec![bt(Color::Red, Shape::Circle, 0, 0)];
    let placements = vec![
        bt(Color::Red, Shape::Square, 1, 0),
        bt(Color::Red, Shape::Diamond, 2, 0),
    ];
    let score = validate_and_score(&board, &placements).unwrap();
    assert_eq!(score, 3, "Line of 3: Red Circle + Square + Diamond");
}

#[test]
fn multi_tile_same_column_valid() {
    let board = vec![bt(Color::Red, Shape::Circle, 0, 0)];
    let placements = vec![
        bt(Color::Blue, Shape::Circle, 0, 1),
        bt(Color::Green, Shape::Circle, 0, 2),
    ];
    let score = validate_and_score(&board, &placements).unwrap();
    // Line of 3 circles in different colors
    assert_eq!(score, 3);
}

#[test]
fn multi_tile_different_row_and_column_rejected() {
    let board = vec![bt(Color::Red, Shape::Circle, 0, 0)];
    let placements = vec![
        bt(Color::Red, Shape::Square, 1, 0),
        bt(Color::Red, Shape::Diamond, 0, 1),
    ];
    assert!(
        validate_and_score(&board, &placements).is_err(),
        "Cannot place tiles in different rows AND columns"
    );
}

// ════════════════════════════════════════════════════
// 7. MULTI-TILE: CONTIGUITY (GAP CHECK)
//    Tiles placed must form a contiguous line with
//    existing tiles — no gaps allowed.
// ════════════════════════════════════════════════════

#[test]
fn multi_tile_with_gap_on_empty_board_rejected() {
    // Place at (0,0) and (2,0) with nothing at (1,0) — gap
    let placements = vec![
        bt(Color::Red, Shape::Circle, 0, 0),
        bt(Color::Red, Shape::Square, 2, 0),
    ];
    // Per official rules, this should be REJECTED (gap in placement line)
    let result = validate_and_score(&[], &placements);
    assert!(
        result.is_err(),
        "BUG: Tiles with gap should be rejected. Got score: {:?}",
        result
    );
}

#[test]
fn multi_tile_with_gap_filled_by_existing_tile_valid() {
    // Existing tile at (1,0) fills the gap between placements at (0,0) and (2,0)
    let board = vec![bt(Color::Red, Shape::Diamond, 1, 0)];
    let placements = vec![
        bt(Color::Red, Shape::Circle, 0, 0),
        bt(Color::Red, Shape::Square, 2, 0),
    ];
    let score = validate_and_score(&board, &placements).unwrap();
    assert_eq!(score, 3, "Red line of 3 (gap filled by existing tile)");
}

// ════════════════════════════════════════════════════
// 8. SCORING: CROSS-LINES
// ════════════════════════════════════════════════════

#[test]
fn cross_scoring_tile_in_two_lines() {
    // Board:
    //   (0,0) Red Circle    (1,0) Red Square
    //   (0,1) Green Circle
    //
    // Place Green Square at (1,1):
    //   Horizontal line: Green Circle (0,1) + Green Square (1,1) = 2
    //   Vertical line: Red Square (1,0) + Green Square (1,1) = 2
    //   Total = 4
    let board = vec![
        bt(Color::Red, Shape::Circle, 0, 0),
        bt(Color::Red, Shape::Square, 1, 0),
        bt(Color::Green, Shape::Circle, 0, 1),
    ];
    let score = validate_and_score(&board, &[bt(Color::Green, Shape::Square, 1, 1)]).unwrap();
    assert_eq!(score, 4);
}

#[test]
fn cross_scoring_tile_extends_two_existing_lines() {
    // Board:
    //   (0,0) Red Circle    (1,0) Red Square    (2,0) Red Diamond
    //   (0,1) Blue Circle   (1,1) Blue Square
    //
    // Place Blue Diamond at (2,1):
    //   Horizontal: Blue Circle + Blue Square + Blue Diamond = 3
    //   Vertical: Red Diamond + Blue Diamond = 2
    //   Total = 5
    let board = vec![
        bt(Color::Red, Shape::Circle, 0, 0),
        bt(Color::Red, Shape::Square, 1, 0),
        bt(Color::Red, Shape::Diamond, 2, 0),
        bt(Color::Blue, Shape::Circle, 0, 1),
        bt(Color::Blue, Shape::Square, 1, 1),
    ];
    let score = validate_and_score(&board, &[bt(Color::Blue, Shape::Diamond, 2, 1)]).unwrap();
    assert_eq!(score, 5);
}

// ════════════════════════════════════════════════════
// 9. SCORING: MULTIPLE TILES FORMING MULTIPLE LINES
// ════════════════════════════════════════════════════

#[test]
fn place_two_tiles_scoring_main_line_plus_cross() {
    // Board:
    //   (0,0) Red Circle
    //   (0,1) Blue Circle
    //
    // Place Red Square at (1,0) and Blue Square at (1,1):
    //   Main line (vertical): Red Square (1,0) + Blue Square (1,1) = same shape line, score 2
    //   Cross at (1,0): Red Circle (0,0) + Red Square (1,0) = 2
    //   Cross at (1,1): Blue Circle (0,1) + Blue Square (1,1) = 2
    //   Total = 2 + 2 + 2 = 6
    let board = vec![
        bt(Color::Red, Shape::Circle, 0, 0),
        bt(Color::Blue, Shape::Circle, 0, 1),
    ];
    let placements = vec![
        bt(Color::Red, Shape::Square, 1, 0),
        bt(Color::Blue, Shape::Square, 1, 1),
    ];
    let score = validate_and_score(&board, &placements).unwrap();
    assert_eq!(score, 6, "2 (main vertical) + 2 (cross top) + 2 (cross bottom)");
}

// ════════════════════════════════════════════════════
// 10. EDGE CASES
// ════════════════════════════════════════════════════

#[test]
fn empty_placement_rejected() {
    let board = vec![bt(Color::Red, Shape::Circle, 0, 0)];
    assert!(validate_and_score(&board, &[]).is_err());
}

#[test]
fn three_copies_same_face_in_different_lines_valid() {
    // In Qwirkle, 3 copies of each face exist in the bag.
    // They can appear on the board but NEVER in the same line.
    //
    //   (0,0) Red Circle   (1,0) Red Square
    //   (0,1) Red Circle   -- this is a different line (vertical)
    //
    // The two Red Circles are in different lines: one horizontal (0,0)-(1,0),
    // one vertical (0,0)-(0,1). But (0,0) Red Circle is in both lines.
    // Actually, placing a second Red Circle at (0,1) creates a vertical line
    // Red Circle + Red Circle which is a DUPLICATE → REJECTED
    let board = vec![
        bt(Color::Red, Shape::Circle, 0, 0),
        bt(Color::Red, Shape::Square, 1, 0),
    ];
    assert!(
        validate_and_score(&board, &[bt(Color::Red, Shape::Circle, 0, 1)]).is_err(),
        "Cannot have duplicate Red Circle in any line (vertical would be Red Circle + Red Circle)"
    );
}

#[test]
fn same_face_in_parallel_lines_valid() {
    // Two Red Circles in parallel lines (not sharing a line) is valid:
    //   (0,0) Red Circle   (1,0) Red Square
    //                      (1,1) Blue Square
    //   (0,2) Red Circle   (1,2) Red Diamond
    //
    // Red Circle at (0,0) and (0,2) are NOT in the same line (gap at (0,1))
    let board = vec![
        bt(Color::Red, Shape::Circle, 0, 0),
        bt(Color::Red, Shape::Square, 1, 0),
        bt(Color::Blue, Shape::Square, 1, 1),
        bt(Color::Red, Shape::Diamond, 1, 2),
    ];
    let result = validate_and_score(&board, &[bt(Color::Red, Shape::Circle, 0, 2)]);
    assert!(
        result.is_ok(),
        "Same face in separate non-connected lines is valid: {:?}",
        result
    );
}

#[test]
fn single_tile_line_of_2_scores_2() {
    let board = vec![bt(Color::Red, Shape::Circle, 0, 0)];
    let score = validate_and_score(&board, &[bt(Color::Red, Shape::Square, 1, 0)]).unwrap();
    assert_eq!(score, 2, "A line of 2 always scores 2");
}

#[test]
fn line_of_5_scores_5() {
    let board = vec![
        bt(Color::Red, Shape::Circle, 0, 0),
        bt(Color::Red, Shape::Square, 1, 0),
        bt(Color::Red, Shape::Diamond, 2, 0),
        bt(Color::Red, Shape::Clover, 3, 0),
    ];
    let score = validate_and_score(&board, &[bt(Color::Red, Shape::FourPointStar, 4, 0)]).unwrap();
    assert_eq!(score, 5, "Line of 5: 5 points (no bonus)");
}

#[test]
fn qwirkle_scores_12() {
    let board = vec![
        bt(Color::Red, Shape::Circle, 0, 0),
        bt(Color::Red, Shape::Square, 1, 0),
        bt(Color::Red, Shape::Diamond, 2, 0),
        bt(Color::Red, Shape::Clover, 3, 0),
        bt(Color::Red, Shape::FourPointStar, 4, 0),
    ];
    let score = validate_and_score(&board, &[bt(Color::Red, Shape::EightPointStar, 5, 0)]).unwrap();
    assert_eq!(score, 12, "Qwirkle = 6 tiles + 6 bonus");
}

// ════════════════════════════════════════════════════
// 11. BAG COMPOSITION
// ════════════════════════════════════════════════════

#[test]
fn bag_has_108_tiles() {
    let bag = TileFace::full_bag();
    assert_eq!(bag.len(), 108);
}

#[test]
fn bag_has_3_of_each_face() {
    use std::collections::HashMap;
    let bag = TileFace::full_bag();
    let mut counts: HashMap<(u8, u8), usize> = HashMap::new();
    for face in &bag {
        *counts.entry((face.color as u8, face.shape as u8)).or_default() += 1;
    }
    assert_eq!(counts.len(), 36, "36 unique faces");
    for (&key, &count) in &counts {
        assert_eq!(count, 3, "Face {:?} should have 3 copies", key);
    }
}

#[test]
fn bag_has_6_colors_and_6_shapes() {
    assert_eq!(Color::ALL.len(), 6);
    assert_eq!(Shape::ALL.len(), 6);
}

// ════════════════════════════════════════════════════
// 12. VALIDATE_LINE INTERNALS
// ════════════════════════════════════════════════════

#[test]
fn mixed_attributes_in_line_rejected() {
    // Red Circle + Blue Square in a horizontal line:
    // neither all same color nor all same shape
    let board = vec![bt(Color::Red, Shape::Circle, 0, 0)];
    assert!(validate_and_score(&board, &[bt(Color::Blue, Shape::Square, 1, 0)]).is_err());
}

#[test]
fn all_same_color_line_with_unique_shapes() {
    let board = vec![
        bt(Color::Green, Shape::Circle, 0, 0),
        bt(Color::Green, Shape::Square, 1, 0),
        bt(Color::Green, Shape::Diamond, 2, 0),
    ];
    let score = validate_and_score(&board, &[bt(Color::Green, Shape::Clover, 3, 0)]).unwrap();
    assert_eq!(score, 4);
}

#[test]
fn all_same_shape_line_with_unique_colors() {
    let board = vec![
        bt(Color::Red, Shape::Circle, 0, 0),
        bt(Color::Blue, Shape::Circle, 0, 1),
        bt(Color::Green, Shape::Circle, 0, 2),
    ];
    let score = validate_and_score(&board, &[bt(Color::Yellow, Shape::Circle, 0, 3)]).unwrap();
    assert_eq!(score, 4);
}

// ════════════════════════════════════════════════════
// 13. REGRESSION: KNOWN EDGE CASES
// ════════════════════════════════════════════════════

#[test]
fn place_tile_that_creates_invalid_cross_line() {
    // Board:
    //   (0,0) Red Circle   (1,0) Red Square
    //   (0,1) Red Diamond
    //
    // Try Blue Circle at (1,1):
    //   Horizontal: Red Diamond (0,1) + Blue Circle (1,1) → Red Diamond + Blue Circle:
    //     different color AND different shape → INVALID
    let board = vec![
        bt(Color::Red, Shape::Circle, 0, 0),
        bt(Color::Red, Shape::Square, 1, 0),
        bt(Color::Red, Shape::Diamond, 0, 1),
    ];
    assert!(validate_and_score(&board, &[bt(Color::Blue, Shape::Circle, 1, 1)]).is_err());
}

#[test]
fn place_tile_valid_in_both_directions() {
    // Board:
    //   (0,0) Red Circle   (1,0) Blue Circle
    //   (0,1) Red Square
    //
    // Place Blue Square at (1,1):
    //   Horizontal: Red Square (0,1) + Blue Square (1,1) → same shape ✓, score 2
    //   Vertical: Blue Circle (1,0) + Blue Square (1,1) → same color ✓, score 2
    //   Total = 4
    let board = vec![
        bt(Color::Red, Shape::Circle, 0, 0),
        bt(Color::Blue, Shape::Circle, 1, 0),
        bt(Color::Red, Shape::Square, 0, 1),
    ];
    let score = validate_and_score(&board, &[bt(Color::Blue, Shape::Square, 1, 1)]).unwrap();
    assert_eq!(score, 4);
}

// ════════════════════════════════════════════════════
// REGRESSION: Game 5 - GDi(-3,2) + RDi(-3,3) should be valid
// ════════════════════════════════════════════════════

#[test]
fn game5_green_diamond_red_diamond_placement() {
    // Exact board state from game 5
    let board = vec![
        bt(Color::Blue, Shape::EightPointStar, 0, 0),
        bt(Color::Blue, Shape::Circle, 0, 1),
        bt(Color::Blue, Shape::Square, 0, 2),
        bt(Color::Blue, Shape::Diamond, 0, 3),
        bt(Color::Orange, Shape::EightPointStar, -1, 0),
        bt(Color::Orange, Shape::Circle, -1, 1),
        bt(Color::Blue, Shape::Clover, 0, 4),
        bt(Color::Orange, Shape::Clover, -1, 4),
        bt(Color::Orange, Shape::Diamond, -1, 3),
        bt(Color::Purple, Shape::Clover, 1, 4),
        bt(Color::Purple, Shape::FourPointStar, 1, 5),
        bt(Color::Orange, Shape::FourPointStar, -1, 5),
        bt(Color::Green, Shape::Circle, -2, 1),
        bt(Color::Green, Shape::FourPointStar, -2, 2),
        bt(Color::Orange, Shape::Clover, -2, 5),
        bt(Color::Yellow, Shape::Clover, -2, 4),
    ];

    // Player tries: Green Diamond at (-3,2) + Red Diamond at (-3,3)
    let placements = vec![
        bt(Color::Green, Shape::Diamond, -3, 2),
        bt(Color::Red, Shape::Diamond, -3, 3),
    ];

    let result = validate_and_score(&board, &placements);
    assert!(
        result.is_ok(),
        "GDi@(-3,2) + RDi@(-3,3) should be valid. Got: {:?}",
        result
    );
    // Horizontal at (-3,2): GDi + G4S(-2,2) = same color, score 2
    // Vertical: GDi(-3,2) + RDi(-3,3) = same shape (Diamond), score 2
    // Total = 4
    assert_eq!(result.unwrap(), 4);
}
