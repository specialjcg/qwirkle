//! In-memory SSE broadcast broker, one channel set per game.

use std::collections::HashMap;
use std::sync::Arc;

use tokio::sync::{mpsc, RwLock};

use crate::domain::game::GameId;

use super::event::SseEvent;

/// Manages SSE subscriptions per game.
#[derive(Debug, Default)]
pub struct SseBroker {
    games: RwLock<HashMap<GameId, Vec<mpsc::Sender<SseEvent>>>>,
}

impl SseBroker {
    pub fn new() -> Arc<Self> {
        Arc::new(Self {
            games: RwLock::new(HashMap::new()),
        })
    }

    /// Subscribe to events for a game. Returns a receiver.
    pub async fn subscribe(&self, game_id: GameId) -> mpsc::Receiver<SseEvent> {
        let (tx, rx) = mpsc::channel(64);
        let mut games = self.games.write().await;
        games.entry(game_id).or_default().push(tx);
        rx
    }

    /// Broadcast an event to all subscribers of a game.
    /// Removes disconnected subscribers.
    pub async fn broadcast(&self, game_id: GameId, event: SseEvent) {
        let mut games = self.games.write().await;
        if let Some(senders) = games.get_mut(&game_id) {
            senders.retain(|tx| tx.try_send(event.clone()).is_ok());
            if senders.is_empty() {
                games.remove(&game_id);
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::domain::player::PlayerId;

    #[tokio::test]
    async fn subscribe_and_receive() {
        let broker = SseBroker::new();
        let game_id = GameId(1);
        let mut rx = broker.subscribe(game_id).await;

        let event = SseEvent::TurnChanged {
            player_id: PlayerId(42),
            pseudo: "Alice".to_string(),
        };
        broker.broadcast(game_id, event).await;

        let received = rx.recv().await.unwrap();
        match received {
            SseEvent::TurnChanged { player_id, pseudo } => {
                assert_eq!(player_id, PlayerId(42));
                assert_eq!(pseudo, "Alice");
            }
            _ => panic!("wrong event type"),
        }
    }

    #[tokio::test]
    async fn broadcast_to_multiple_subscribers() {
        let broker = SseBroker::new();
        let game_id = GameId(1);
        let mut rx1 = broker.subscribe(game_id).await;
        let mut rx2 = broker.subscribe(game_id).await;

        broker
            .broadcast(
                game_id,
                SseEvent::TilesSwapped {
                    player_id: PlayerId(1),
                },
            )
            .await;

        assert!(rx1.recv().await.is_some());
        assert!(rx2.recv().await.is_some());
    }

    #[tokio::test]
    async fn broadcast_to_wrong_game_does_nothing() {
        let broker = SseBroker::new();
        let mut rx = broker.subscribe(GameId(1)).await;

        broker
            .broadcast(
                GameId(2),
                SseEvent::TilesSwapped {
                    player_id: PlayerId(1),
                },
            )
            .await;

        // Nothing received - try_recv should fail
        assert!(rx.try_recv().is_err());
    }

    #[tokio::test]
    async fn disconnected_subscriber_is_removed() {
        let broker = SseBroker::new();
        let game_id = GameId(1);

        // Subscribe then drop receiver
        let rx = broker.subscribe(game_id).await;
        drop(rx);

        // Broadcast should clean up the dead sender
        broker
            .broadcast(
                game_id,
                SseEvent::TilesSwapped {
                    player_id: PlayerId(1),
                },
            )
            .await;

        // After cleanup, subscribing again should work fine
        let mut rx2 = broker.subscribe(game_id).await;
        broker
            .broadcast(
                game_id,
                SseEvent::TurnChanged {
                    player_id: PlayerId(2),
                    pseudo: "Bob".to_string(),
                },
            )
            .await;
        assert!(rx2.recv().await.is_some());
    }
}
