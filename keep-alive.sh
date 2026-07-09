#!/bin/bash
# Kill any existing server first
fuser -k 3000/tcp 2>/dev/null
sleep 1

while true; do
  cd /home/z/my-project/.next/standalone
  PORT=3000 node server.js 2>>/home/z/my-project/server.log
  EXIT_CODE=$?
  echo "[$(date)] Server exited with code $EXIT_CODE, restarting in 2s..." >> /home/z/my-project/server.log
  sleep 2
  # Kill any leftover processes on port 3000
  fuser -k 3000/tcp 2>/dev/null
  sleep 1
done
