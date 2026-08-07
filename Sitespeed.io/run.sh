#!/usr/bin/env bash
set -euo pipefail

: "${MEASUREMENT_EMAIL:?Set MEASUREMENT_EMAIL before running}"
: "${MEASUREMENT_PASSWORD:?Set MEASUREMENT_PASSWORD before running}"

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

npx sitespeed.io \
  --preScript "$DIR/login.js" \
  --multi \
  --spa \
  --axe.enable \
  --browsertime.headless true \
  --outputFolder sitespeed-result \
  -n 1 \
  "$DIR/measure.js"
