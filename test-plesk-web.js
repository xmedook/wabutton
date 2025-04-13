/**
 * Test script to verify that the application is accessible from the web
 * 
 * This script makes an HTTP request to the application URL to check if it's running
 * and accessible from the web. It's useful for verifying that the Plesk configuration
 * is working correctly.
 * 
 * Usage: node test-plesk-web.js [url]
 * Example: node test-plesk-web.js http://wabutton.nexodigital.ai
 */

const http = require('http');
const https = require('https');

// Get the URL from command line arguments or use default
const url = process.argv[2] || 'http://wabutton.nexodigital.ai';
const healthUrl = `${url}/health`;

console.log(`Testing web access to: ${url}`);
console.log(`Will also check health endpoint at: ${healthUrl}`);

// Parse the URL to determine if it's HTTP or HTTPS
const parsedUrl = new URL(url);
const client = parsedUrl.protocol === 'https:' ? https : http;

// Make a request to the URL
const req = client.get(url, (res) => {
  console.log(`Status Code: ${res.statusCode}`);
  console.log(`Status Message: ${res.statusMessage}`);
  console.log(`Headers: ${JSON.stringify(res.headers, null, 2)}`);
  
  let data = '';
  
  // A chunk of data has been received
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  // The whole response has been received
  res.on('end', () => {
    console.log(`Response size: ${data.length} bytes`);
    
    if (res.statusCode >= 200 && res.statusCode < 300) {
      console.log('✅ Application is accessible from the web!');
    } else {
      console.log('❌ Application returned a non-success status code.');
      console.log('This might indicate a problem with the application or its configuration.');
    }
    
    // Check if the response contains expected content
    if (data.includes('<html') && data.includes('WhatsApp')) {
      console.log('✅ Response contains expected content!');
    } else {
      console.log('⚠️ Response does not contain expected content.');
      console.log('This might indicate that the application is not serving the correct content.');
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Error making request:');
  console.error(error.message);
  console.log('This might indicate that the application is not running or not accessible from the web.');
  console.log('Check your Plesk configuration and make sure the application is running.');
});

req.end();

// Now check the health endpoint
console.log('\n--- Checking health endpoint ---');
const healthReq = client.get(healthUrl, (res) => {
  console.log(`Health Status Code: ${res.statusCode}`);
  
  let data = '';
  
  // A chunk of data has been received
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  // The whole response has been received
  res.on('end', () => {
    if (res.statusCode >= 200 && res.statusCode < 300) {
      console.log('✅ Health endpoint is accessible!');
      
      try {
        const healthData = JSON.parse(data);
        console.log('Health Data:');
        console.log(JSON.stringify(healthData, null, 2));
        
        if (healthData.status === 'ok') {
          console.log('✅ Application reports healthy status!');
        } else {
          console.log('⚠️ Application reports unhealthy status.');
        }
        
        if (healthData.mongodb === 'connected') {
          console.log('✅ MongoDB connection is established!');
        } else {
          console.log('❌ MongoDB connection is not established.');
          console.log('Check your MongoDB connection string and make sure MongoDB is running.');
        }
      } catch (e) {
        console.log('❌ Failed to parse health data as JSON:');
        console.log(data);
      }
    } else {
      console.log('❌ Health endpoint returned a non-success status code.');
      console.log('This might indicate a problem with the application or its configuration.');
    }
  });
});

healthReq.on('error', (error) => {
  console.error('❌ Error checking health endpoint:');
  console.error(error.message);
});

healthReq.end();

// Set a timeout to avoid hanging if the request takes too long
setTimeout(() => {
  console.error('❌ Request timed out after 10 seconds.');
  console.log('This might indicate that the application is not running or not accessible from the web.');
  console.log('Check your Plesk configuration and make sure the application is running.');
  process.exit(1);
}, 10000);
