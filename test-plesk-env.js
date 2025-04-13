/**
 * Test script for Plesk Node.js environment
 * 
 * This script simulates the Plesk Node.js environment by setting the
 * Plesk-specific environment variables and then running the application.
 * 
 * Usage: node test-plesk-env.js
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Simulate Plesk environment variables
process.env.PLESK_NODE_PORT = '3000';
process.env.PLESK_DOCUMENT_ROOT = process.cwd();
process.env.NODE_ENV = 'production';

console.log('=== Testing Plesk Node.js Environment ===');
console.log(`Current directory: ${process.cwd()}`);
console.log(`PLESK_NODE_PORT: ${process.env.PLESK_NODE_PORT}`);
console.log(`PLESK_DOCUMENT_ROOT: ${process.env.PLESK_DOCUMENT_ROOT}`);
console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log('=======================================');

// Check if plesk-start.js exists
const pleskStartPath = path.join(process.cwd(), 'plesk-start.js');
if (fs.existsSync(pleskStartPath)) {
  console.log('Found plesk-start.js, testing with it...');
  
  // Run plesk-start.js
  const pleskStart = spawn('node', ['plesk-start.js'], {
    cwd: process.cwd(),
    stdio: 'inherit',
    env: process.env
  });
  
  pleskStart.on('close', (code) => {
    console.log(`plesk-start.js process exited with code ${code}`);
    if (code !== 0) {
      console.log('Testing with server.js directly...');
      testWithServerJs();
    }
  });
} else {
  console.log('plesk-start.js not found, testing with server.js directly...');
  testWithServerJs();
}

function testWithServerJs() {
  // Run server.js directly
  const serverStart = spawn('node', ['server.js'], {
    cwd: process.cwd(),
    stdio: 'inherit',
    env: process.env
  });
  
  serverStart.on('close', (code) => {
    console.log(`server.js process exited with code ${code}`);
  });
}

// Handle Ctrl+C to terminate the test
process.on('SIGINT', () => {
  console.log('Test terminated by user');
  process.exit(0);
});
