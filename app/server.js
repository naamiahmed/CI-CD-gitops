/**
 * ============================================================
 * SIMPLE NODE.JS BACKEND SERVER
 * ============================================================
 * This is the main server file that initializes and starts
 * the Express.js application with multiple API endpoints
 * 
 * Author: Naami Ahmed
 * Date: 2026
 * ============================================================
 */

// ============================================================
// 1. IMPORT REQUIRED DEPENDENCIES
// ============================================================
// These packages are imported from node_modules
// Express: Web framework for creating server and APIs
// CORS: Middleware to handle Cross-Origin Resource Sharing
// dotenv: Load environment variables from .env file
const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Load environment variables

// ============================================================
// 2. IMPORT CUSTOM ROUTES AND MIDDLEWARE
// ============================================================
// Import our custom route handlers from the routes folder
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');

// ============================================================
// 3. INITIALIZE THE EXPRESS APPLICATION
// ============================================================
// Create an instance of the Express application
const app = express();

// ============================================================
// 4. GET CONFIGURATION FROM ENVIRONMENT VARIABLES
// ============================================================
// Define the PORT from environment or use default 5000
// For example: PORT=3000 npm start
const PORT = process.env.PORT || 5000;

// ============================================================
// 5. MIDDLEWARE CONFIGURATION
// ============================================================
// Middleware are functions that process requests before they reach routes

// Enable CORS - Allows requests from different domains
// This is important when your frontend is on a different domain
app.use(cors());

// Parse incoming JSON data
// When a client sends JSON data, this middleware converts it to JavaScript object
app.use(express.json());

// Parse incoming form data (URL-encoded)
// This allows us to handle form submissions
app.use(express.urlencoded({ extended: true }));

// ============================================================
// 6. CUSTOM MIDDLEWARE - REQUEST LOGGER
// ============================================================
// This middleware logs every incoming request
// Format: [TIMESTAMP] METHOD URL
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next(); // Pass control to the next middleware/route
});

// ============================================================
// 7. HEALTH CHECK ENDPOINT
// ============================================================
// This endpoint can be used to verify if the server is running
// Useful for monitoring and deployment checks
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Server is running successfully!',
    timestamp: new Date().toISOString(),
  });
});

// ============================================================
// 8. ROOT ENDPOINT
// ============================================================
// Welcome message when accessing the root URL
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to Simple Node.js API',
    version: '1.0.0',
    author: 'Naami Ahmed',
    availableEndpoints: {
      users: '/api/users',
      products: '/api/products',
      orders: '/api/orders',
      health: '/health',
    },
  });
});

// ============================================================
// 9. REGISTER API ROUTES
// ============================================================
// Mount the route handlers at specific endpoints
// Routes are organized by resource (users, products, orders)
// All routes are prefixed with /api/

// User routes: GET, POST, PUT, DELETE operations
app.use('/api/users', userRoutes);

// Product routes: Browse and manage products
app.use('/api/products', productRoutes);

// Order routes: Create and track orders
app.use('/api/orders', orderRoutes);

// ============================================================
// 10. ERROR HANDLING MIDDLEWARE
// ============================================================
// This middleware catches errors from routes and sends appropriate responses
// It should be defined AFTER all other routes

// 404 Not Found Handler
// When a request doesn't match any route, it reaches this handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `The endpoint ${req.method} ${req.url} does not exist`,
    status: 404,
  });
});

// Global Error Handler
// Catches errors thrown in route handlers
// Error format: app.use((err, req, res, next) => {...})
// Note: All 4 parameters are required for Express to recognize it as error handler
app.use((err, req, res, next) => {
  console.error('ERROR:', err.message);
  
  // Send error response to client
  res.status(err.status || 500).json({
    error: err.name || 'Internal Server Error',
    message: err.message || 'An unexpected error occurred',
    status: err.status || 500,
  });
});

// ============================================================
// 11. START THE SERVER
// ============================================================
// Listen on the specified PORT
// Once started, the server will accept incoming requests
const server = app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║   🚀 SERVER STARTED SUCCESSFULLY       ║
╚════════════════════════════════════════╝
  
  📍 Server Running on: http://localhost:${PORT}
  🌍 Environment: ${process.env.NODE_ENV || 'development'}
  
  📚 Available Endpoints:
    • GET  http://localhost:${PORT}/ (Welcome)
    • GET  http://localhost:${PORT}/health (Health Check)
    • GET  http://localhost:${PORT}/api/users (Get all users)
    • POST http://localhost:${PORT}/api/users (Create user)
    • GET  http://localhost:${PORT}/api/products (Get all products)
    • POST http://localhost:${PORT}/api/products (Create product)
    • GET  http://localhost:${PORT}/api/orders (Get all orders)
    • POST http://localhost:${PORT}/api/orders (Create order)

  Press Ctrl+C to stop the server
════════════════════════════════════════
  `);
});

// ============================================================
// 12. GRACEFUL SHUTDOWN
// ============================================================
// Handle server shutdown gracefully
// This ensures database connections and resources are properly closed
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server has been shut down');
    process.exit(0);
  });
});

// ============================================================
// EXPORT FOR TESTING (Optional)
// ============================================================
// Export the app for testing frameworks
module.exports = app;
