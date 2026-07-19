#!/bin/bash
cd /home/z/my-project/.next/standalone

# Sync download-count.json from project root (use the latest one)
if [ -f /home/z/my-project/download-count.json ]; then
  cp /home/z/my-project/download-count.json ./
fi

# Ensure static files exist
if [ ! -d .next/static ]; then
  cp -r /home/z/my-project/.next/static .next/ 2>/dev/null
fi

# Ensure public folder exists
if [ ! -d public ]; then
  cp -r /home/z/my-project/public . 2>/dev/null
fi

export NODE_ENV=production
export PORT=3000
export HOSTNAME=0.0.0.0
echo "[DEV] Starting Next.js server on port 3000..."
exec node server.js
