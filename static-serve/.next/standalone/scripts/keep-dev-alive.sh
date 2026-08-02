#!/bin/bash
# Keep Next.js dev server alive - auto-restart if it dies
PORT=3000
LOG=/tmp/nextdev.log
DIR=/home/z/my-project

while true; do
  # Kill any existing process on port
  fuser -k ${PORT}/tcp 2>/dev/null
  sleep 2

  # Start dev server
  cd $DIR && npx next dev -p $PORT >> $LOG 2>&1 &
  SERVER_PID=$!
  echo "[$(date)] Started dev server (PID: $SERVER_PID)" >> $LOG

  # Wait and check if server responds
  sleep 8
  if curl -s -o /dev/null http://localhost:${PORT} 2>/dev/null; then
    echo "[$(date)] Server is responding on port ${PORT}" >> $LOG
  else
    echo "[$(date)] Server NOT responding, will restart" >> $LOG
    kill $SERVER_PID 2>/dev/null
    continue
  fi

  # Monitor - restart if server dies
  while true; do
    sleep 10
    if ! curl -s -o /dev/null http://localhost:${PORT} 2>/dev/null; then
      echo "[$(date)] Server died, restarting..." >> $LOG
      kill $SERVER_PID 2>/dev/null
      break
    fi
  done
done
