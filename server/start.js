const { spawn } = require('child_process');
const path = require('path');

let serverProcess = null;
let restartCount = 0;
const maxRestarts = 5;

function startServer() {
  console.log('🚀 Starting LabFlow Admin API Server...');
  
  serverProcess = spawn('node', [path.join(__dirname, 'index.js')], {
    stdio: 'inherit',
    cwd: path.dirname(__dirname)
  });

  serverProcess.on('close', (code) => {
    console.log(`\n💥 Server process exited with code ${code}`);
    
    if (code !== 0 && restartCount < maxRestarts) {
      restartCount++;
      console.log(`🔄 Restarting server (attempt ${restartCount}/${maxRestarts})...`);
      setTimeout(startServer, 2000); // Wait 2 seconds before restart
    } else if (restartCount >= maxRestarts) {
      console.log('❌ Max restart attempts reached. Server stopped.');
      process.exit(1);
    }
  });

  serverProcess.on('error', (err) => {
    console.error('💥 Failed to start server process:', err);
  });
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  if (serverProcess) {
    serverProcess.kill('SIGINT');
  }
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down server...');
  if (serverProcess) {
    serverProcess.kill('SIGTERM');
  }
  process.exit(0);
});

// Start the server
startServer();
