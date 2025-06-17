const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
require('dotenv').config(); // Load .env variables

const app = express();

// Import your route handlers
const authRoutes = require('./routes/authRoutes'); // Auth route file
const userRoutes = require('./routes/userRoutes'); // Optional if needed
const reportRoutes = require('./routes/reportRoutes'); // Optional if needed

// Middleware - Security & Performance
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      mediaSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https:"],
      fontSrc: ["'self'", "https:", "data:"],
      objectSrc: ["'none'"],
      frameSrc: ["'self'"],
    },
  },
}));
app.use(cors());
app.use(morgan('dev'));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test routes
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to PathXpert API! 🚀',
    version: '1.0.0',
    status: 'active'
  });
});

app.get('/ping', (req, res) => {
  res.json({ message: 'pong' });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API routes
app.use('/api/auth', authRoutes); // Login/Register routes
app.use('/api/users', userRoutes); // User-related routes
app.use('/api/reports', reportRoutes); // Report-related routes

// 404 handler
app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

// General error handler
app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    error: {
      message: error.message,
      status: error.status || 500
    }
  });
});

// Server startup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`💥 Server running at http://localhost:${PORT}`);
});
