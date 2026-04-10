#!/usr/bin/env bash
set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

TOTAL_PASS=0
TOTAL_FAIL=0

section() {
  echo -e "\n${CYAN}${BOLD}── $1 ──${NC}"
}

# ── Backend Rust ──

ROOT="$(cd "$(dirname "$0")" && pwd)"

section "Backend: cargo build"
cd "$ROOT/backend"
cargo build --quiet 2>&1
echo -e "${GREEN}Build OK${NC}"

section "Backend: cargo test"
OUTPUT=$(cargo test 2>&1)
echo "$OUTPUT" | grep "test result"

PASS=$(echo "$OUTPUT" | grep "test result" | awk '{s+=$4} END {print s}')
FAIL=$(echo "$OUTPUT" | grep "test result" | awk '{s+=$6} END {print s}')
TOTAL_PASS=$((TOTAL_PASS + PASS))
TOTAL_FAIL=$((TOTAL_FAIL + FAIL))

# ── Frontend Elm ──

section "Frontend: elm make"
cd "$ROOT/frontend"
npx elm make src/Main.elm --output=/dev/null 2>&1 | tail -1
echo -e "${GREEN}Build OK${NC}"

section "Frontend: elm-test"
OUTPUT=$(npx elm-test 2>&1)
echo "$OUTPUT" | grep -E "^Passed|^Failed|^Duration"

PASS=$(echo "$OUTPUT" | grep "^Passed:" | awk '{print $2}')
FAIL=$(echo "$OUTPUT" | grep "^Failed:" | awk '{print $2}')
TOTAL_PASS=$((TOTAL_PASS + PASS))
TOTAL_FAIL=$((TOTAL_FAIL + FAIL))

# ── Summary ──

echo ""
echo -e "${BOLD}════════════════════════════════${NC}"
if [ "$TOTAL_FAIL" -eq 0 ]; then
  echo -e "${GREEN}${BOLD}  ALL PASSED: ${TOTAL_PASS} tests, 0 failed${NC}"
else
  echo -e "${RED}${BOLD}  ${TOTAL_PASS} passed, ${TOTAL_FAIL} FAILED${NC}"
fi
echo -e "${BOLD}════════════════════════════════${NC}"

exit "$TOTAL_FAIL"
