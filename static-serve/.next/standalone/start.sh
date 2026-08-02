#!/bin/bash
cd /home/z/my-project
fuser -k 3000/tcp 2>/dev/null
sleep 1
exec bunx next dev -p 3000 2>&1 | tee /home/z/my-project/dev.log
