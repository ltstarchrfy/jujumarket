#!/bin/bash
while true; do
  if ! curl -s -o /dev/null http://localhost:3000/ 2>/dev/null; then
    pkill -f "standalone/server" 2>/dev/null
    sleep 1
    cd /home/z/my-project
    node .next/standalone/server.js &
    sleep 3
  fi
  sleep 5
done
