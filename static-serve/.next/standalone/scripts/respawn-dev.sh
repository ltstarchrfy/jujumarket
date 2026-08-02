#!/bin/bash
cd /home/z/my-project
while true; do
  NODE_OPTIONS="--max-old-space-size=256" npx next dev -p 3000 2>/dev/null
  sleep 2
done
