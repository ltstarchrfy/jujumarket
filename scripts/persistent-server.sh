#!/bin/bash
# Persistent Next.js server for production
cd /home/z/my-project

# Build first if needed
if [ ! -f .next/BUILD_ID ]; then
  echo "Building Next.js..."
  npx next build 2>&1
fi

# Copy static files to standalone (needed for standalone mode)
if [ ! -d .next/standalone/.next/static ]; then
  cp -r .next/static .next/standalone/.next/
fi

# Copy public folder if exists
if [ -d public ] && [ ! -d .next/standalone/public ]; then
  cp -r public .next/standalone/
fi

# Start standalone server
cd .next/standalone
export NODE_ENV=production
export PORT=3000
export HOSTNAME=0.0.0.0

echo "Starting Next.js standalone server on port 3000..."
exec node server.js
