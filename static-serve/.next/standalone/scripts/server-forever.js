const { spawn } = require('child_process');
const path = require('path');

function startServer() {
  console.log(`[${new Date().toISOString()}] Starting Next.js dev server...`);
  
  const child = spawn('npx', ['next', 'dev', '-p', '3000', '-H', '0.0.0.0'], {
    cwd: '/home/z/my-project',
    stdio: 'inherit',
    detached: false,
    env: { ...process.env }
  });

  child.on('exit', (code, signal) => {
    console.log(`[${new Date().toISOString()}] Server exited with code ${code}, signal ${signal}. Restarting in 3s...`);
    setTimeout(startServer, 3000);
  });

  child.on('error', (err) => {
    console.error(`[${new Date().toISOString()}] Server error: ${err.message}. Restarting in 3s...`);
    setTimeout(startServer, 3000);
  });
}

startServer();

// Keep the process alive
setInterval(() => {
  // heartbeat
}, 30000);
