#!/bin/bash
cd /home/z/my-project/.next/standalone
while true; do
  PORT=3000 node server.js &
  SERVER_PID=$!
  # Keep alive for 10 minutes, then restart
  sleep 600
  kill $SERVER_PID 2>/dev/null
  sleep 2
done
