#!/bin/bash
cd /home/z/my-project
fuser -k 3000/tcp 2>/dev/null
sleep 1

# Start dev server
./node_modules/.bin/next dev -p 3000 &
NEXT_PID=$!

# Wait for server to be ready
for i in $(seq 1 30); do
  if curl -s -o /dev/null http://localhost:3000/ 2>/dev/null; then
    echo "SERVER READY on port 3000"
    break
  fi
  sleep 1
done

# Keep alive - check every 5 seconds, restart if dead
while true; do
  if ! curl -s -o /dev/null http://localhost:3000/ 2>/dev/null; then
    echo "Server died, restarting..."
    kill $NEXT_PID 2>/dev/null
    sleep 1
    ./node_modules/.bin/next dev -p 3000 &
    NEXT_PID=$!
    sleep 5
  fi
  sleep 5
done
