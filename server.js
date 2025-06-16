require('dotenv').config();

// Core imports
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const mongoose = require('mongoose');

// Initialize Express app
const app = express();

// Try importing authRoutes
let authRoutes;
try {
  authRoutes = require('./routes/authRoutes');
} catch (err) {
  console.error('❌ Error loading authRoutes:', err);
  console.warn('⚠️ Firebase auth not configured - some auth routes may not work');
}

const profileRoutes = require('./routes/profileRoutes');
const reportRoutes = require('./routes/reportRoutes');
const userRoutes = require('./routes/userRoutes');

// Helmet with CSP
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        mediaSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'", 'https:'],
        fontSrc: ["'self'", 'https:', 'data:'],
        objectSrc: ["'none'"],
        frameSrc: ["'self'"]
      }
    }
  })
);

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use((req, res, next) => {
  console.log(`🌐 Incoming ${req.method} request to ${req.originalUrl}`);
  console.log(`🔑 Auth header: ${req.headers.authorization ? 'Present' : 'Missing'}`);
  next();
});
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000
    });
    console.log(`MongoDB Connected: ${conn.connection.host} 💖`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message} 💔`);
    process.exit(1);
  }
};
connectDB();

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to PathXpert API! 🚀',
    version: '1.0.0',
    status: 'active'
  });
});

app.get('/ping', (req, res) => res.json({ message: 'pong' }));

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    uptime: process.uptime(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

console.log('🔄 Setting up API routes...');

if (authRoutes) {
  app.use('/api/auth', (req, res, next) => {
    console.log(`🔐 Auth route accessed: ${req.method} ${req.originalUrl}`);
    next();
  }, authRoutes);
}

app.use('/api/reports', (req, res, next) => {
  console.log(`📄 Reports route accessed: ${req.method} ${req.originalUrl}`);
  next();
}, reportRoutes);

app.use('/api/users', (req, res, next) => {
  console.log(`👤 Users route accessed: ${req.method} ${req.originalUrl}`);
  next();
}, userRoutes);

app.use('/api/profile', (req, res, next) => {
  console.log(`👤 Profile route accessed: ${req.method} ${req.originalUrl}`);
  next();
}, profileRoutes);

console.log('✅ API routes configured');

// 404 Handler
app.use((req, res, next) => {
  console.log(`❌ 404 - Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    status: 'fail',
    message: 'Route not found',
    path: req.originalUrl
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    status: statusCode >= 500 ? 'error' : 'fail',
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start server on fixed port
const PORT = process.env.PORT || 8002;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`❤️ Health check: http://localhost:${PORT}/health`);
});

// Export app
module.exports = app;
