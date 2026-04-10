//! Qwirkle tile colors.

use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize, sqlx::Type)]
#[repr(u8)]
pub enum Color {
    Green = 1,
    Blue = 2,
    Purple = 3,
    Red = 4,
    Orange = 5,
    Yellow = 6,
}

impl Color {
    pub const ALL: [Color; 6] = [
        Color::Green,
        Color::Blue,
        Color::Purple,
        Color::Red,
        Color::Orange,
        Color::Yellow,
    ];
}
