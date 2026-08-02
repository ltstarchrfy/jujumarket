#!/bin/bash
cd /home/z/my-project
# Start Next.js dev server in background
npx next dev -p 3000 2>&1 | tee /tmp/nextdev.log &
SERVER_PID=$!

# Wait for server to be ready
for i in $(seq 1 30); do
  if curl -s -o /dev/null http://localhost:3000 2>/dev/null; then
    echo "Server is ready on port 3000"
    break
  fi
  sleep 1
done

# Keep alive loop - ping server every 4 seconds to keep it running
while true; do
  curl -s -o /dev/null http://localhost:3000 2>/dev/null
  sleep 4
done
