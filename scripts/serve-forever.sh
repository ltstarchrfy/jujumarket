#!/bin/bash
cd /home/z/my-project
while true; do
  node .next/standalone/server.js 2>&1
  sleep 1
done
