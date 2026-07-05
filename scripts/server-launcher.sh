#!/bin/bash
cd /home/z/my-project
export NODE_ENV=production
while true; do
  node node_modules/.bin/next start -p 3000
  echo "[$(date)] Server exited, restarting in 2s..." >> /tmp/server-restart.log
  sleep 2
done
