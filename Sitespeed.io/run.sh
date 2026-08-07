#!/usr/bin/env bash
set -euo pipefail

: "${MEASUREMENT_EMAIL:?Set MEASUREMENT_EMAIL before running}"
: "${MEASUREMENT_PASSWORD:?Set MEASUREMENT_PASSWORD before running}"

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$DIR/.." && pwd)"

# Docker image bundles Chrome, FFmpeg, XVFB and Visual Metrics deps.
# Video / visual metrics do not work with --browsertime.headless.
IMAGE="${SITESPEED_DOCKER_IMAGE:-sitespeedio/sitespeed.io:42.6.0}"

docker run --rm \
  --shm-size=1g \
  --cap-add=NET_ADMIN \
  -v "$ROOT:/sitespeed.io" \
  -e MEASUREMENT_EMAIL \
  -e MEASUREMENT_PASSWORD \
  "$IMAGE" \
  --preScript Sitespeed.io/login.js \
  --multi \
  --spa \
  --outputFolder sitespeed-result \
  -n 1 \
  -c cable \
  --connectivity.engine throttle \
  --video \
  --visualMetrics \
  --visualMetricsPerceptual \
  --visualMetricsContentful \
  --visualElements \
  --filmstrip.showAll \
  --browsertime.videoParams.filmstripDiff \
  --axe.enable \
  --sustainable.enable \
  --thirdParty.cpu \
  --enableProfileRun \
  --chrome.coverage \
  --chrome.collectConsoleLog \
  --chrome.collectNetLog \
  --chrome.enableTraceScreenshots \
  --html.showAllWaterfallSummary \
  Sitespeed.io/measure.js
