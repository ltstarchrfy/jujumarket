#!/bin/bash
while true; do
  cd /home/z/my-project/.next/standalone
  PORT=3000 node server.js
  echo "Server died, restarting in 3 seconds..."
  sleep 3
done
