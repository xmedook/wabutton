/**
 * Application Monitoring Script
 * 
 * This script periodically checks the health of the application and logs any issues.
 * It can be run as a cron job to monitor the application and ensure it's running correctly.
 * 
 * Usage: node monitor.js [url] [interval]
 * Example: node monitor.js http://wabutton.nexodigital.ai 5
 * 
 * The interval is in minutes and defaults to 5 minutes if not specified.
 */

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

// Get the URL and interval from command line arguments or use defaults
const url = process.argv[2] || 'http://wabutton.nexodigital.ai';
const intervalMinutes = parseInt(process.argv[3], 10) || 5;
const intervalMs = intervalMinutes * 60 * 1000;
const healthUrl = `${url}/health`;
const logFile = path.join(__dirname, 'monitor.log');

// Log function to log to console and file
function log(message, isError = false) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}`;
  
  if (isError) {
    console.error(logMessage);
  } else {
    console.log(logMessage);
  }
  
  // Append to log file
  fs.appendFileSync(logFile, logMessage + '\n');
}

// Function to check the health of the application
function checkHealth() {
  log(`Checking health at: ${healthUrl}`);
  
  // Parse the URL to determine if it's HTTP or HTTPS
  const parsedUrl = new URL(healthUrl);
  const client = parsedUrl.protocol === 'https:' ? https : http;
  
  const req = client.get(healthUrl, (res) => {
    let data = '';
    
    // A chunk of data has been received
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    // The whole response has been received
    res.on('end', () => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        try {
          const healthData = JSON.parse(data);
          log(`Health status: ${healthData.status}`);
          log(`MongoDB: ${healthData.mongodb}`);
          log(`Uptime: ${healthData.uptime} seconds`);
          
          if (healthData.status !== 'ok' || healthData.mongodb !== 'connected') {
            log(`WARNING: Application health check failed. Status: ${healthData.status}, MongoDB: ${healthData.mongodb}`, true);
          }
        } catch (e) {
          log(`ERROR: Failed to parse health data as JSON: ${e.message}`, true);
        }
      } else {
        log(`ERROR: Health endpoint returned status code ${res.statusCode}`, true);
      }
    });
  });
  
  req.on('error', (error) => {
    log(`ERROR: Failed to connect to health endpoint: ${error.message}`, true);
  });
  
  req.setTimeout(10000, () => {
    req.abort();
    log('ERROR: Request to health endpoint timed out after 10 seconds', true);
  });
  
  req.end();
}

// Initial check
log('Starting application monitoring');
log(`URL: ${url}`);
log(`Health URL: ${healthUrl}`);
log(`Check interval: ${intervalMinutes} minutes`);
log(`Log file: ${logFile}`);
checkHealth();

// Schedule periodic checks
setInterval(checkHealth, intervalMs);

// Handle process termination
process.on('SIGINT', () => {
  log('Monitoring stopped by user');
  process.exit(0);
});

process.on('SIGTERM', () => {
  log('Monitoring stopped');
  process.exit(0);
});

log('Monitoring is running. Press Ctrl+C to stop.');
