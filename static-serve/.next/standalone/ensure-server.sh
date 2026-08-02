#!/bin/bash
# Check if server is already running
if curl -s -o /dev/null http://localhost:3000/ 2>/dev/null; then
  echo "Server already running on port 3000"
  exit 0
fi

# Kill stale processes and restart
fuser -k 3000/tcp 2>/dev/null
sleep 1

cd /home/z/my-project
nohup ./node_modules/.bin/next dev -p 3000 > /home/z/my-project/server.log 2>&1 &

# Wait for server to be ready (up to 15 seconds)
for i in $(seq 1 15); do
  if curl -s -o /dev/null http://localhost:3000/ 2>/dev/null; then
    echo "Server started successfully on port 3000"
    exit 0
  fi
  sleep 1
done

echo "Failed to start server"
exit 1
