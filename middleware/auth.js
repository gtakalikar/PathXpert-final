const admin = require('../config/firebase');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/AppError');

// 🔐 Dual Auth Middleware: Firebase & JWT
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        status: 'fail',
        message: 'Unauthorized - No token provided'
      });
    }

    const token = authHeader.split(' ')[1];
    let user;

    // 🔍 1. Try Firebase Token
    try {
      const decoded = await admin.auth().verifyIdToken(token);

      // Lookup user by Firebase UID
      user = await User.findOne({ uid: decoded.uid });

      // Create user if doesn't exist
      if (!user) {
        user = await User.create({
          uid: decoded.uid,
          email: decoded.email,
          displayName: decoded.name || decoded.email?.split('@')[0],
          photoURL: decoded.picture || null
        });
      }
    } catch (firebaseErr) {
      // 🛑 Firebase failed — fallback to JWT
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check expiry
        if (decoded.exp && decoded.exp < Date.now() / 1000) {
          return res.status(401).json({
            status: 'fail',
            message: 'Token expired, please login again'
          });
        }

        // Find user by Mongo ID
        user = await User.findById(decoded.uid || decoded.id);
        if (!user) {
          return res.status(401).json({
            status: 'fail',
            message: 'User not found'
          });
        }
      } catch (jwtErr) {
        return res.status(401).json({
          status: 'fail',
          message: 'Invalid token'
        });
      }
    }

    // 💖 Attach authenticated user
    req.user = user;
    next();
  } catch (error) {
    console.error('❌ Auth Middleware Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Authentication failed',
      error: error.message
    });
  }
};

// 🛡️ Role-based Authorization Middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'fail',
        message: `User role '${req.user?.role || 'undefined'}' is not authorized to access this route`
      });
    }
    next();
  };
};

module.exports = {
  auth: authMiddleware,
  authorize
};
