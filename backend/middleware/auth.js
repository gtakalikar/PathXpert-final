
const admin = require('../config/firebase'); // your firebase admin SDK config
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        status: 'fail',
        message: 'Unauthorized - No token provided',
      });
    }

    const token = authHeader.split(' ')[1];
    let user;

    try {
      // Try verifying Firebase token first
      const decodedFirebase = await admin.auth().verifyIdToken(token);

      user = await User.findOne({ uid: decodedFirebase.uid });

      if (!user) {
        // Create user if not exists (optional, depends on your logic)
        user = await User.create({
          uid: decodedFirebase.uid,
          email: decodedFirebase.email,
          displayName: decodedFirebase.name || (decodedFirebase.email?.split('@')[0]),
          photoURL: decodedFirebase.picture || null,
        });
      }
    } catch (firebaseErr) {
      // Firebase token verification failed, try JWT fallback
      try {
        const decodedJwt = jwt.verify(token, process.env.JWT_SECRET);

        if (decodedJwt.exp && decodedJwt.exp < Date.now() / 1000) {
          return res.status(401).json({
            status: 'fail',
            message: 'Token expired, please login again',
          });
        }

        const userId = decodedJwt.uid || decodedJwt.id;
        user = await User.findById(userId);

        if (!user) {
          return res.status(401).json({
            status: 'fail',
            message: 'User not found',
          });
        }
      } catch (jwtErr) {
        // JWT verification failed too
        return res.status(401).json({
          status: 'fail',
          message: 'Invalid token',
        });
      }
    }

    req.user = user; // Attach user to request
    next();
  } catch (error) {
    console.error('❌ Auth Middleware Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Authentication failed',
      error: error.message,
    });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'fail',
        message: `User role '${req.user?.role || 'undefined'}' is not authorized to access this route`,
      });
    }
    next();
  };
};

module.exports = {
  auth: authMiddleware,
  authorize,
};
