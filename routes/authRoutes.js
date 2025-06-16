// Import necessary packages
const express = require('express');
const router = express.Router();
const admin = require('../config/firebase');


// Import controllers
const {
  login,
  register,
  getMe,
  logout,
  sendOTP,
  verifyOTP,
  forgotPassword, // ⬅️ Add this
  resetPassword,   // ⬅️ Add this too
  googleLogin // 🧠 here we import it
} = require('../controllers/authController');

// Middleware for protecting routes
const { auth } = require('../middleware/auth');

// ─── 🟢 PUBLIC ROUTES ──────────────────────────────────────────

// Register a new user
router.post('/register', register);

// Login existing user
router.post('/login', login);

// Send OTP
router.post('/send-otp', sendOTP);

// Verify OTP
router.post('/verify-otp', verifyOTP);


// 🧠 Use Controller’s forgotPassword instead of inline
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);




// Google Login
router.post('/google-login', googleLogin); // 👑 star feature


// ─── 🔒 PROTECTED ROUTES ─────────────────────────────────────

// Get current user
router.get('/me', auth, getMe);

// Logout
router.post('/logout', auth, logout);



// ─── EXPORT THE ROUTER ───────────────────────────────────────
module.exports = router;


