#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
BACKEND_PORT="${PORT:-3001}"

echo "── Building frontend ──"
cd "$ROOT/frontend"
npx elm make src/Main.elm --output=static/elm.js 2>&1 | tail -1

echo "── Building backend ──"
cd "$ROOT/backend"
cargo build --release --quiet 2>&1

echo "── Starting backend on port $BACKEND_PORT ──"
PORT="$BACKEND_PORT" "$ROOT/backend/target/release/qwirkle-backend" &
BACKEND_PID=$!

cleanup() {
  echo ""
  echo "Shutting down..."
  kill "$BACKEND_PID" 2>/dev/null || true
  wait "$BACKEND_PID" 2>/dev/null || true
}
trap cleanup EXIT INT TERM

sleep 1

echo ""
echo "════════════════════════════════════"
echo "  http://localhost:$BACKEND_PORT"
echo ""
echo "  Press Ctrl+C to stop"
echo "════════════════════════════════════"

wait "$BACKEND_PID"
