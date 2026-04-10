//! Qwirkle tile shapes.

use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize, sqlx::Type)]
#[repr(u8)]
pub enum Shape {
    Circle = 1,
    Square = 2,
    Diamond = 3,
    Clover = 4,
    FourPointStar = 5,
    EightPointStar = 6,
}

impl Shape {
    pub const ALL: [Shape; 6] = [
        Shape::Circle,
        Shape::Square,
        Shape::Diamond,
        Shape::Clover,
        Shape::FourPointStar,
        Shape::EightPointStar,
    ];
}
