//! Rollout-based bot: for each candidate move, simulate K complete rollouts
//! (random bag draws + greedy single-tile opponent) and pick the move with
//! highest expected score differential.
//!
//! Optimizations:
//! - Rollouts use a fast single-tile-only greedy (no 2-tile combinatorics)
//! - Parallelized across candidates and rollouts via rayon
//! - Bounded depth to control latency

use std::collections::HashSet;
use rand::seq::SliceRandom;
use rand::Rng;
use rayon::prelude::*;

use super::ai::{best_moves, ScoredMove};
use super::rules::validate_and_score;
use super::tile::{BoardTile, Coordinate, RackTile, TileFace};

/// Default number of rollouts per candidate move.
pub const DEFAULT_K_ROLLOUTS: usize = 20;

/// Default rollout depth (max moves to simulate per rollout).
pub const DEFAULT_ROLLOUT_DEPTH: usize = 8;

/// Maximum number of candidate moves to evaluate.
pub const TOP_K_CANDIDATES: usize = 8;

/// Pick the best move by parallel Monte Carlo rollouts.
pub fn rollout_best_move(
    board: &[BoardTile],
    rack: &[TileFace],
    bag: &[TileFace],
    player_score: i32,
    opponent_score: i32,
    k_rollouts: usize,
    depth: usize,
) -> Option<ScoredMove> {
    let rack_tiles: Vec<RackTile> = rack
        .iter()
        .enumerate()
        .map(|(i, &face)| RackTile { face, rack_position: i as u8 })
        .collect();

    let candidates = best_moves(board, &rack_tiles);
    if candidates.is_empty() {
        return None;
    }
    if candidates.len() == 1 {
        return Some(candidates[0].clone());
    }

    let candidates_to_eval: Vec<&ScoredMove> = candidates.iter().take(TOP_K_CANDIDATES).collect();

    // Parallel evaluation across candidates
    let results: Vec<(usize, f64)> = candidates_to_eval
        .par_iter()
        .enumerate()
        .map(|(idx, candidate)| {
            // Apply candidate move
            let mut new_board = board.to_vec();
            new_board.extend_from_slice(&candidate.tiles);

            let mut new_rack: Vec<TileFace> = rack.to_vec();
            for tile in &candidate.tiles {
                if let Some(pos) = new_rack.iter().position(|&f| f == tile.face) {
                    new_rack.remove(pos);
                }
            }

            // Run K rollouts (each rollout uses thread-local rng)
            let total: i32 = (0..k_rollouts)
                .map(|_| {
                    let mut rng = rand::thread_rng();
                    rollout_fast(
                        &new_board,
                        &new_rack,
                        bag,
                        player_score + candidate.score,
                        opponent_score,
                        depth,
                        &mut rng,
                    )
                })
                .sum();

            let mean = total as f64 / k_rollouts as f64;
            // Tie-break toward higher immediate score
            let combined = mean + candidate.score as f64 * 0.05;
            (idx, combined)
        })
        .collect();

    // Find best
    let best = results.iter().max_by(|a, b| a.1.partial_cmp(&b.1).unwrap()).unwrap();
    Some(candidates_to_eval[best.0].clone())
}

/// Fast single-tile greedy rollout. Returns final score diff (player - opponent).
fn rollout_fast(
    board: &[BoardTile],
    player_rack: &[TileFace],
    bag: &[TileFace],
    player_score: i32,
    opponent_score: i32,
    max_turns: usize,
    rng: &mut impl Rng,
) -> i32 {
    let mut board: Vec<BoardTile> = board.to_vec();
    let mut bag: Vec<TileFace> = bag.to_vec();
    bag.shuffle(rng);

    // Sample opponent rack from the bag
    let opp_rack_size = 6.min(bag.len());
    let mut opp_rack: Vec<TileFace> = bag.drain(..opp_rack_size).collect();

    let mut player_rack: Vec<TileFace> = player_rack.to_vec();
    while player_rack.len() < 6 && !bag.is_empty() {
        player_rack.push(bag.pop().unwrap());
    }

    let mut scores = [player_score, opponent_score];
    let mut current = 1usize; // Opponent plays next
    let mut passes = 0;

    for _ in 0..max_turns {
        let active_rack_clone = if current == 0 { player_rack.clone() } else { opp_rack.clone() };

        // Fast single-tile greedy
        let chosen = best_single_tile(&board, &active_rack_clone);

        match chosen {
            None => {
                passes += 1;
                if passes >= 4 { break; }
                let active = if current == 0 { &mut player_rack } else { &mut opp_rack };
                let n = 3.min(active.len()).min(bag.len());
                if n > 0 {
                    let drained: Vec<_> = active.drain(..n).collect();
                    bag.extend(drained);
                    bag.shuffle(rng);
                    for _ in 0..n {
                        if let Some(t) = bag.pop() { active.push(t); }
                    }
                }
                current = 1 - current;
                continue;
            }
            Some((face, coord, score)) => {
                passes = 0;
                scores[current] += score;
                board.push(BoardTile { face, coordinate: coord });
                let active = if current == 0 { &mut player_rack } else { &mut opp_rack };
                if let Some(pos) = active.iter().position(|&f| f == face) {
                    active.remove(pos);
                }
                if let Some(t) = bag.pop() {
                    active.push(t);
                }

                if active.is_empty() && bag.is_empty() {
                    scores[current] += 6;
                    break;
                }

                current = 1 - current;
            }
        }
    }

    scores[0] - scores[1]
}

/// Find the best single-tile placement (no 2-tile combinatorics).
/// Returns (face, coord, score) or None.
fn best_single_tile(board: &[BoardTile], rack: &[TileFace]) -> Option<(TileFace, Coordinate, i32)> {
    let occupied: HashSet<Coordinate> = board.iter().map(|t| t.coordinate).collect();

    let candidates: Vec<Coordinate> = if board.is_empty() {
        vec![Coordinate { x: 0, y: 0 }]
    } else {
        let mut set: HashSet<Coordinate> = HashSet::new();
        for c in &occupied {
            for (dx, dy) in [(1, 0), (-1, 0), (0, 1), (0, -1)] {
                let n = Coordinate { x: c.x + dx, y: c.y + dy };
                if !occupied.contains(&n) {
                    set.insert(n);
                }
            }
        }
        set.into_iter().collect()
    };

    let mut best: Option<(TileFace, Coordinate, i32)> = None;
    let mut seen_faces: HashSet<TileFace> = HashSet::new();

    for &face in rack {
        if !seen_faces.insert(face) { continue; }
        for &coord in &candidates {
            let placement = vec![BoardTile { face, coordinate: coord }];
            if let Ok(score) = validate_and_score(board, &placement) {
                if best.as_ref().map_or(true, |(_, _, s)| score > *s) {
                    best = Some((face, coord, score));
                }
            }
        }
    }

    best
}
