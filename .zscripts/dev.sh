#!/bin/bash
cd /home/z/my-project

# Build first
echo "[DEV] Building Next.js..."
npx next build 2>&1

# Start production server
echo "[DEV] Starting Next.js production server..."
NODE_ENV=production node .next/standalone/server.js &

# Keep alive - if server dies, restart it
while true; do
  if ! curl -s -o /dev/null http://localhost:3000 2>/dev/null; then
    echo "[DEV] Server died, restarting..."
    NODE_ENV=production node .next/standalone/server.js &
  fi
  sleep 5
done
