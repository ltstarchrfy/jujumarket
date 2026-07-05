#!/bin/bash
cd /home/z/my-project
# Kill any existing server
kill -9 $(lsof -t -i:3000) 2>/dev/null
sleep 1
# Start production server
exec NODE_ENV=production node .next/standalone/server.js
