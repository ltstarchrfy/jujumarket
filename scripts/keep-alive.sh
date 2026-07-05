#!/bin/bash
while true; do
  if ! curl -s -o /dev/null http://localhost:3000 2>/dev/null; then
    cd /home/z/my-project && npx next dev -p 3000 >> /tmp/nx.log 2>&1 &
    sleep 8
  fi
  sleep 5
done
