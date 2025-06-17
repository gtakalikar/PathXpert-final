const express = require('express');
const router = express.Router();
const admin = require('../config/firebase');

const {
  login,
  register,
  getMe,
  logout,
  sendOTP,
  verifyOTP,
  forgotPassword,
  resetPassword,
  googleLogin
} = require('../controllers/authController');

const { auth } = require('../middleware/auth');

// ─── 🟢 PUBLIC ROUTES ──────────────────────────────────────────
router.post('/register', register);
router.post('/login', login);
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.post('/google-login', googleLogin);

// ─── 🔒 PROTECTED ROUTES ─────────────────────────────────────
router.get('/me', auth, getMe);
router.post('/logout', auth, logout);

// ─── EXPORT ───────────────────────────────────────────────
module.exports = router;
