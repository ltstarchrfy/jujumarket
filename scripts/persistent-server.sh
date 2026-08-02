#!/bin/bash
# Persistent server - respawn on crash
PORT=3000
cd /home/z/my-project

while true; do
  echo "[$(date)] Starting server on port $PORT..."
  node .next/standalone/server.js 2>&1
  EXIT=$?
  echo "[$(date)] Server exited with code $EXIT, restarting in 3s..."
  sleep 3
done
