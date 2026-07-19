#!/bin/bash
while true; do
  if ! curl -s -o /dev/null http://localhost:3000/ 2>/dev/null; then
    cd /home/z/my-project
    fuser -k 3000/tcp 2>/dev/null
    sleep 2
    nohup npx next dev -p 3000 >> /home/z/my-project/next-dev.log 2>&1 &
    sleep 8
  fi
  sleep 5
done
