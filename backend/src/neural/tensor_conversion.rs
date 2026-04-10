//! Convert Qwirkle board states to tensors for the Graph Transformer.

#![cfg(feature = "neural")]

use std::collections::{HashMap, HashSet};
use tch::{Kind, Tensor};

use crate::domain::color::Color;
use crate::domain::shape::Shape;
use crate::domain::rules::get_line;
use crate::domain::tile::{BoardTile, Coordinate, Direction, TileFace};
use super::graph_transformer::{INPUT_DIM, MAX_NODES, CONTEXT_DIM};

/// A node in the board graph.
#[derive(Debug, Clone)]
pub struct BoardNode {
    pub coordinate: Coordinate,
    pub is_occupied: bool,
    pub is_candidate: bool,
    pub is_from_rack: bool,
    pub face: Option<TileFace>,
}

/// Game context for the value network.
#[derive(Debug, Clone)]
pub struct GameContext {
    pub bag_remaining: f32,
    pub player_score: f32,
    pub opponent_score: f32,
    pub rack_size: f32,
}

impl GameContext {
    pub fn to_tensor(&self) -> Tensor {
        Tensor::from_slice(&[
            self.bag_remaining / 108.0,
            self.player_score / 200.0,
            self.opponent_score / 200.0,
            self.rack_size / 6.0,
        ])
    }
}

/// Extract graph nodes from a board state.
/// Returns (nodes, centroid_x, centroid_y, radius).
pub fn extract_nodes(
    board: &[BoardTile],
    from_rack: &[BoardTile],
) -> Vec<BoardNode> {
    let mut occupied: HashSet<Coordinate> = HashSet::new();
    let mut nodes: Vec<BoardNode> = Vec::new();

    // Add existing board tiles
    for tile in board {
        occupied.insert(tile.coordinate);
        nodes.push(BoardNode {
            coordinate: tile.coordinate,
            is_occupied: true,
            is_candidate: false,
            is_from_rack: false,
            face: Some(tile.face),
        });
    }

    // Add what-if tiles from rack
    for tile in from_rack {
        if !occupied.contains(&tile.coordinate) {
            occupied.insert(tile.coordinate);
            nodes.push(BoardNode {
                coordinate: tile.coordinate,
                is_occupied: true,
                is_candidate: false,
                is_from_rack: true,
                face: Some(tile.face),
            });
        }
    }

    // Add candidate cells (empty neighbors)
    let mut candidates: HashSet<Coordinate> = HashSet::new();
    for coord in &occupied {
        for neighbor in neighbors(*coord) {
            if !occupied.contains(&neighbor) {
                candidates.insert(neighbor);
            }
        }
    }

    // If board is empty, add origin as candidate
    if occupied.is_empty() {
        candidates.insert(Coordinate { x: 0, y: 0 });
    }

    for coord in candidates {
        nodes.push(BoardNode {
            coordinate: coord,
            is_occupied: false,
            is_candidate: true,
            is_from_rack: false,
            face: None,
        });
    }

    // Truncate to MAX_NODES (keep all occupied, truncate candidates by distance)
    if nodes.len() > MAX_NODES as usize {
        let (cx, cy) = centroid(&nodes);
        // Separate occupied and candidate nodes
        let (occ, mut cand): (Vec<_>, Vec<_>) = nodes.into_iter().partition(|n| n.is_occupied);
        // Sort candidates by distance from centroid (closest first)
        cand.sort_by(|a, b| {
            let da = manhattan_dist(a.coordinate, cx, cy);
            let db = manhattan_dist(b.coordinate, cx, cy);
            da.partial_cmp(&db).unwrap()
        });
        let remaining = (MAX_NODES as usize).saturating_sub(occ.len());
        cand.truncate(remaining);
        nodes = occ;
        nodes.extend(cand);
    }

    nodes
}

/// Encode nodes into a tensor [max_nodes, INPUT_DIM].
/// Returns (features_tensor, mask_tensor).
pub fn nodes_to_tensor(
    nodes: &[BoardNode],
    board: &[BoardTile],
) -> (Tensor, Tensor) {
    let node_count = nodes.len().min(MAX_NODES as usize);
    let mut features = vec![0.0f32; (MAX_NODES * INPUT_DIM) as usize];
    let mut mask = vec![false; MAX_NODES as usize];

    let (cx, cy) = centroid(nodes);
    let radius = nodes.iter()
        .map(|n| manhattan_dist(n.coordinate, cx, cy))
        .fold(1.0f32, f32::max);

    // Build board map for line queries
    let board_map: HashMap<Coordinate, TileFace> = board.iter()
        .map(|t| (t.coordinate, t.face))
        .collect();

    for (i, node) in nodes.iter().enumerate().take(node_count) {
        let offset = i * INPUT_DIM as usize;
        mask[i] = true;

        // Color one-hot (dims 0-5)
        if let Some(face) = &node.face {
            let ci = color_index(face.color);
            features[offset + ci] = 1.0;
            // Shape one-hot (dims 6-11)
            let si = shape_index(face.shape);
            features[offset + 6 + si] = 1.0;
        }

        // Is-occupied (dim 12)
        features[offset + 12] = if node.is_occupied { 1.0 } else { 0.0 };
        // Is-candidate (dim 13)
        features[offset + 13] = if node.is_candidate { 1.0 } else { 0.0 };
        // Is-from-rack (dim 14)
        features[offset + 14] = if node.is_from_rack { 1.0 } else { 0.0 };

        // Normalized position (dims 15-16)
        features[offset + 15] = (node.coordinate.x as f32 - cx) / radius;
        features[offset + 16] = (node.coordinate.y as f32 - cy) / radius;

        // Neighbor count (dim 17)
        let nc = neighbors(node.coordinate)
            .iter()
            .filter(|n| board_map.contains_key(n))
            .count();
        features[offset + 17] = nc as f32 / 4.0;

        // Horizontal line length and completeness (dims 18-19)
        let h_line = get_line(&board_map, node.coordinate, Direction::Horizontal);
        features[offset + 18] = h_line.len() as f32 / 6.0;
        features[offset + 19] = line_completeness(&h_line);

        // Vertical line length and completeness (dims 20-21)
        let v_line = get_line(&board_map, node.coordinate, Direction::Vertical);
        features[offset + 20] = v_line.len() as f32 / 6.0;
        features[offset + 21] = line_completeness(&v_line);
    }

    let features_tensor = Tensor::from_slice(&features)
        .view([MAX_NODES, INPUT_DIM]);
    let mask_tensor = Tensor::from_slice(
        &mask.iter().map(|&b| if b { 1i64 } else { 0i64 }).collect::<Vec<_>>()
    ).to_kind(Kind::Bool);

    (features_tensor, mask_tensor)
}

/// Batch multiple (features, mask) pairs into tensors.
pub fn batch_tensors(
    samples: &[(Tensor, Tensor, Tensor)], // (features, mask, context)
) -> (Tensor, Tensor, Tensor) {
    let features: Vec<Tensor> = samples.iter().map(|(f, _, _)| f.unsqueeze(0)).collect();
    let masks: Vec<Tensor> = samples.iter().map(|(_, m, _)| m.unsqueeze(0)).collect();
    let contexts: Vec<Tensor> = samples.iter().map(|(_, _, c)| c.unsqueeze(0)).collect();

    (
        Tensor::cat(&features, 0),
        Tensor::cat(&masks, 0),
        Tensor::cat(&contexts, 0),
    )
}

/// Build an action mask for the policy head.
/// For each node that is a candidate (empty neighbor), mark which tile faces
/// from the rack could legally be placed there.
/// Returns: [MAX_NODES, 36] bool tensor.
pub fn build_action_mask(
    nodes: &[BoardNode],
    board: &[BoardTile],
    rack: &[TileFace],
) -> Tensor {
    use crate::domain::rules::validate_and_score;
    use super::graph_transformer::{MAX_NODES, NUM_TILE_FACES};

    let node_count = nodes.len().min(MAX_NODES as usize);
    let mut mask = vec![false; (MAX_NODES * NUM_TILE_FACES) as usize];

    for (i, node) in nodes.iter().enumerate().take(node_count) {
        if !node.is_candidate {
            continue;
        }
        for face in rack {
            let placement = vec![BoardTile {
                face: *face,
                coordinate: node.coordinate,
            }];
            if validate_and_score(board, &placement).is_ok() {
                let face_idx = tile_face_index(face);
                mask[i * NUM_TILE_FACES as usize + face_idx] = true;
            }
        }
    }

    Tensor::from_slice(
        &mask.iter().map(|&b| if b { 1i64 } else { 0i64 }).collect::<Vec<_>>()
    )
    .view([MAX_NODES, NUM_TILE_FACES])
    .to_kind(Kind::Bool)
}

/// Map a TileFace to an index in [0, 36).
pub fn tile_face_index(face: &TileFace) -> usize {
    color_index(face.color) * 6 + shape_index(face.shape)
}

/// Inverse: index [0, 36) → TileFace.
pub fn tile_face_from_index(idx: usize) -> TileFace {
    use crate::domain::color::Color;
    use crate::domain::shape::Shape;
    let ci = idx / 6;
    let si = idx % 6;
    TileFace {
        color: Color::ALL[ci],
        shape: Shape::ALL[si],
    }
}

// ── Helpers ──

fn neighbors(c: Coordinate) -> [Coordinate; 4] {
    [
        Coordinate { x: c.x + 1, y: c.y },
        Coordinate { x: c.x - 1, y: c.y },
        Coordinate { x: c.x, y: c.y + 1 },
        Coordinate { x: c.x, y: c.y - 1 },
    ]
}

fn centroid(nodes: &[BoardNode]) -> (f32, f32) {
    if nodes.is_empty() {
        return (0.0, 0.0);
    }
    let sum_x: f32 = nodes.iter().map(|n| n.coordinate.x as f32).sum();
    let sum_y: f32 = nodes.iter().map(|n| n.coordinate.y as f32).sum();
    let n = nodes.len() as f32;
    (sum_x / n, sum_y / n)
}

fn manhattan_dist(c: Coordinate, cx: f32, cy: f32) -> f32 {
    (c.x as f32 - cx).abs() + (c.y as f32 - cy).abs()
}

fn color_index(c: Color) -> usize {
    match c {
        Color::Green => 0,
        Color::Blue => 1,
        Color::Purple => 2,
        Color::Red => 3,
        Color::Orange => 4,
        Color::Yellow => 5,
    }
}

fn shape_index(s: Shape) -> usize {
    match s {
        Shape::Circle => 0,
        Shape::Square => 1,
        Shape::Diamond => 2,
        Shape::Clover => 3,
        Shape::FourPointStar => 4,
        Shape::EightPointStar => 5,
    }
}

/// Compute how "complete" a line is (distinct attributes / max_possible).
fn line_completeness(line: &[(Coordinate, TileFace)]) -> f32 {
    if line.is_empty() {
        return 0.0;
    }
    let colors: HashSet<u8> = line.iter().map(|(_, f)| f.color as u8).collect();
    let shapes: HashSet<u8> = line.iter().map(|(_, f)| f.shape as u8).collect();
    // A valid line is either all same color (unique shapes) or all same shape (unique colors)
    let max_distinct = colors.len().max(shapes.len());
    max_distinct as f32 / 6.0
}

#[cfg(test)]
mod tests {
    use super::*;

    fn bt(color: Color, shape: Shape, x: i32, y: i32) -> BoardTile {
        BoardTile {
            face: TileFace { color, shape },
            coordinate: Coordinate { x, y },
        }
    }

    #[test]
    fn empty_board_has_origin_candidate() {
        let nodes = extract_nodes(&[], &[]);
        assert_eq!(nodes.len(), 1);
        assert!(nodes[0].is_candidate);
        assert_eq!(nodes[0].coordinate, Coordinate { x: 0, y: 0 });
    }

    #[test]
    fn single_tile_board_nodes() {
        let board = vec![bt(Color::Red, Shape::Circle, 0, 0)];
        let nodes = extract_nodes(&board, &[]);
        // 1 occupied + 4 candidates
        assert_eq!(nodes.len(), 5);
        assert_eq!(nodes.iter().filter(|n| n.is_occupied).count(), 1);
        assert_eq!(nodes.iter().filter(|n| n.is_candidate).count(), 4);
    }

    #[test]
    fn what_if_tiles_marked() {
        let board = vec![bt(Color::Red, Shape::Circle, 0, 0)];
        let from_rack = vec![bt(Color::Red, Shape::Square, 1, 0)];
        let nodes = extract_nodes(&board, &from_rack);
        let rack_nodes: Vec<_> = nodes.iter().filter(|n| n.is_from_rack).collect();
        assert_eq!(rack_nodes.len(), 1);
        assert_eq!(rack_nodes[0].coordinate, Coordinate { x: 1, y: 0 });
    }

    #[test]
    fn tensor_shape_correct() {
        let board = vec![bt(Color::Red, Shape::Circle, 0, 0)];
        let nodes = extract_nodes(&board, &[]);
        let (features, mask) = nodes_to_tensor(&nodes, &board);
        assert_eq!(features.size(), vec![MAX_NODES, INPUT_DIM]);
        assert_eq!(mask.size(), vec![MAX_NODES]);
    }

    #[test]
    fn mask_valid_count() {
        let board = vec![
            bt(Color::Red, Shape::Circle, 0, 0),
            bt(Color::Blue, Shape::Square, 1, 0),
        ];
        let nodes = extract_nodes(&board, &[]);
        let (_, mask) = nodes_to_tensor(&nodes, &board);
        let valid_count = mask.sum(Kind::Int64).int64_value(&[]);
        assert_eq!(valid_count, nodes.len() as i64);
    }

    #[test]
    fn context_tensor_shape() {
        let ctx = GameContext {
            bag_remaining: 90.0,
            player_score: 15.0,
            opponent_score: 10.0,
            rack_size: 6.0,
        };
        let t = ctx.to_tensor();
        assert_eq!(t.size(), vec![CONTEXT_DIM]);
    }
}
