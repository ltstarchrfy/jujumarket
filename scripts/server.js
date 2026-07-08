const { createServer } = require('http');
const next = require('next');
const path = require('path');

// Simple keep-alive: just start the standalone server
const { execSync, spawn } = require('child_process');

function startServer() {
  const child = spawn('node', [path.join(__dirname, '../.next/standalone/server.js')], {
    env: { ...process.env, NODE_ENV: 'production', PORT: '3000', HOSTNAME: '0.0.0.0' },
    stdio: 'inherit'
  });
  
  child.on('exit', (code) => {
    console.log(`Server exited with code ${code}, restarting in 3s...`);
    setTimeout(startServer, 3000);
  });
  
  return child;
}

startServer();

// Keep process alive
setInterval(() => {}, 60000);
