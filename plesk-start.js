/**
 * Plesk Node.js Application Startup File
 * 
 * This file is designed to be used as the startup file for Plesk Node.js applications.
 * It ensures that the application is started with PM2 for proper process management.
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Log function to track startup process
function log(message) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`);
  
  // Also log to a file for debugging
  fs.appendFileSync(
    path.join(__dirname, 'plesk-startup.log'), 
    `[${timestamp}] ${message}\n`
  );
}

// Get Plesk-specific environment variables
const pleskPort = process.env.PLESK_NODE_PORT;
const pleskDocumentRoot = process.env.PLESK_DOCUMENT_ROOT;

log('Starting application with Plesk Node.js configuration');
log(`Plesk Node.js Port: ${pleskPort || 'Not set'}`);
log(`Plesk Document Root: ${pleskDocumentRoot || 'Not set'}`);

// Update environment variables for the application
process.env.PORT = pleskPort || process.env.PORT || 3000;

// Check if PM2 is installed
try {
  const pm2Path = require.resolve('pm2');
  log(`PM2 found at: ${pm2Path}`);
} catch (err) {
  log('PM2 not found in node_modules. Installing PM2...');
  
  // Install PM2 if not found
  const npmInstall = spawn('npm', ['install', 'pm2', '--no-save'], {
    cwd: __dirname,
    stdio: 'inherit'
  });
  
  npmInstall.on('close', (code) => {
    if (code !== 0) {
      log(`Failed to install PM2. Exit code: ${code}`);
      process.exit(1);
    }
    startWithPM2();
  });
} finally {
  startWithPM2();
}

function startWithPM2() {
  log('Starting application with PM2...');
  
  // Check if ecosystem.config.js exists
  const ecosystemPath = path.join(__dirname, 'ecosystem.config.js');
  if (fs.existsSync(ecosystemPath)) {
    log('Found ecosystem.config.js, using it to start the application');
    
    // Start the application using PM2 with ecosystem.config.js
    const pm2Start = spawn('npx', ['pm2', 'start', ecosystemPath], {
      cwd: __dirname,
      stdio: 'inherit',
      env: {
        ...process.env,
        PORT: process.env.PORT,
        NODE_ENV: 'production'
      }
    });
    
    pm2Start.on('close', (code) => {
      log(`PM2 process exited with code ${code}`);
      if (code !== 0) {
        // If PM2 fails, fall back to starting server.js directly
        startServerDirectly();
      }
    });
  } else {
    log('No ecosystem.config.js found, starting server.js directly with PM2');
    
    // Start server.js directly with PM2
    const pm2Start = spawn('npx', ['pm2', 'start', 'server.js'], {
      cwd: __dirname,
      stdio: 'inherit',
      env: {
        ...process.env,
        PORT: process.env.PORT,
        NODE_ENV: 'production'
      }
    });
    
    pm2Start.on('close', (code) => {
      log(`PM2 process exited with code ${code}`);
      if (code !== 0) {
        // If PM2 fails, fall back to starting server.js directly
        startServerDirectly();
      }
    });
  }
}

function startServerDirectly() {
  log('Falling back to starting server.js directly with Node.js');
  
  // Start server.js directly with Node.js as a fallback
  const nodeStart = spawn('node', ['server.js'], {
    cwd: __dirname,
    stdio: 'inherit',
    env: {
      ...process.env,
      PORT: process.env.PORT,
      NODE_ENV: 'production'
    }
  });
  
  nodeStart.on('close', (code) => {
    log(`Node.js process exited with code ${code}`);
    process.exit(code);
  });
}
