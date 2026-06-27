#!/usr/bin/env bash
# Auto-restart wrapper for ASTUTE Next.js dev server
cd /home/z/my-project

while true; do
  echo "[$(date -u +%Y-%m-%dT%H:%M:%SZ)] Starting next dev..."
  ./node_modules/.bin/next dev -p 3000 -H 0.0.0.0 2>&1 | tee -a /home/z/my-project/dev.log
  EXIT=$?
  echo "[$(date -u +%Y-%m-%dT%H:%M:%SZ)] next dev exited with code $EXIT - restarting in 3s"
  sleep 3
done
