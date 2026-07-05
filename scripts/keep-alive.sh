#!/bin/bash
# Keep-alive ping for Next.js dev server
while true; do
  curl -s -o /dev/null http://localhost:3000 2>/dev/null
  sleep 5
done
