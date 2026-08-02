#!/bin/bash
cd /home/z/my-project/out
fuser -k 3000/tcp 2>/dev/null
sleep 1
exec python3 -m http.server 3000
