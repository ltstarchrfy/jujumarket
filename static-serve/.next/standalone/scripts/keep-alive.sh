#!/bin/bash
cd /home/z/my-project
while true; do
  echo "[$(date)] Starting Next.js dev server..."
  npx next dev -p 3000 -H 0.0.0.0 2>&1
  echo "[$(date)] Server exited, restarting in 3s..."
  sleep 3
done
