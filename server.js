const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const mongoose = require('mongoose');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/widgets', require('./routes/widget.routes'));

// Health check endpoint for monitoring
app.get('/health', (req, res) => {
  const healthData = {
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  };
  
  // Add Plesk-specific information if available
  if (process.env.PLESK_NODE_PORT) {
    healthData.plesk = {
      port: process.env.PLESK_NODE_PORT,
      documentRoot: process.env.PLESK_DOCUMENT_ROOT || 'Not set'
    };
  }
  
  res.status(200).json(healthData);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
const PORT = process.env.PLESK_NODE_PORT || process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  
  // Log Plesk-specific information if available
  if (process.env.PLESK_NODE_PORT) {
    console.log(`Using Plesk Node.js configuration on port ${process.env.PLESK_NODE_PORT}`);
    console.log(`Plesk Document Root: ${process.env.PLESK_DOCUMENT_ROOT || 'Not set'}`);
  }
  
  // Log database connection info (without sensitive details)
  const dbUri = process.env.MONGODB_URI || 'Not configured';
  const maskedUri = dbUri.replace(/:([^:@]+)@/, ':****@');
  console.log(`MongoDB URI: ${maskedUri}`);
  
  // Log application startup success
  console.log(`Application started successfully at ${new Date().toISOString()}`);
});

// Graceful shutdown handler
async function shutdownGracefully(signal) {
  console.log(`${signal} received, shutting down gracefully`);
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    process.exit(0);
  } catch (err) {
    console.error('Error during graceful shutdown:', err);
    process.exit(1);
  }
}

// Handle process termination gracefully
process.on('SIGTERM', () => shutdownGracefully('SIGTERM'));
process.on('SIGINT', () => shutdownGracefully('SIGINT'));
