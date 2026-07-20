#!/bin/bash
cd /home/z/my-project/.next/standalone

# Sync download-count.json from project root (use the latest one)
if [ -f /home/z/my-project/download-count.json ]; then
  cp /home/z/my-project/download-count.json ./
fi

# Always sync static files (copy fresh every start)
rm -rf .next/static
cp -r /home/z/my-project/.next/static .next/ 2>/dev/null

# Always sync public folder (copy fresh every start)
rm -rf public
cp -r /home/z/my-project/public . 2>/dev/null

export NODE_ENV=production
export PORT=3000
export HOSTNAME=0.0.0.0
# Optimize Node.js for performance
export NODE_OPTIONS="--max-old-space-size=384"
export KEEP_ALIVE_TIMEOUT=65000

echo "[DEV] Starting Next.js server on port 3000..."
exec node server.js
