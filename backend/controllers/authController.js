const express = require('express');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Otp = require('../models/Otp');
const { secureOTP } = require('../utils/generateOTP');
const { sendOTPEmail, sendResetPasswordEmail } = require('../utils/sendEmail');

const JWT_SECRET = process.env.JWT_SECRET || 'yourSecretKey';

if (JWT_SECRET === 'yourSecretKey') {
  console.warn('⚠️ WARNING: Using default JWT_SECRET. Set a strong one in .env!');
}



// ─────────────────────────────────────────────
// 👑 Register Controller
// ─────────────────────────────────────────────


exports.register = async (req, res) => {
  let email = req.body.email?.trim().toLowerCase();
const { firstName, lastName, username, password } = req.body;

  

  try {
    
    // 💣 Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: 'fail',
        message: 'User already registered with this email ',
      });
    }

    // 💖 Create and save new user
    const newUser = new User({
      firstName,
      lastName,
      username,
      email,
      password,
      authType: 'local',
    });

    await newUser.save(); // 👑 Saved to MongoDB
    console.log('✅ User saved:', newUser);

    // 🔑 Generate JWT
    if (!newUser.generateAuthToken) {
      console.error('❌ generateAuthToken is undefined!');
      return res.status(500).json({
        status: 'error',
        message: 'Auth token generation failed.',
      });
    }

    const token = newUser.generateAuthToken();
    console.log('🛡️ Token:', token);

    // 📩 Respond with success
    res.status(201).json({
      status: 'success',
      message: 'User registered successfully 🎉',
      token,
      user: {
        id: newUser._id,
        email: newUser.email,
        username: newUser.username,
        fullName: newUser.fullName, // Optional: virtual field
      },
    });
  } catch (err) {
    // 🧨 Handle unique constraint errors
    if (err.code === 11000) {
      return res.status(400).json({
        status: 'fail',
        message: `Duplicate field: ${Object.keys(err.keyValue).join(', ')} already in use.`,
      });
    }

    console.error('❌ Register Error:', err);
    res.status(500).json({ status: 'error', message: 'Server error, babe 😔' });
  }
};

// ─────────────────────────────────────────────
// 🔐 Login
// ─────────────────────────────────────────────
exports.login = async (req, res) => {
  const { email, password } = req.body;
  console.log('🌐 Login request for:', email);

  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ success: false, message: 'Invalid email or password' });
    }

    const token = user.generateAuthToken();
    const userObj = user.toObject();

    res.status(200).json({
      success: true,
      token,
      user: {
        ...userObj,
        id: user._id,
      },
    });
  } catch (err) {
    console.error('❌ Login Error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─────────────────────────────────────────────
// 🔐 Get Current User
// ─────────────────────────────────────────────
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.status(200).json({ status: 'success', user });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Unable to fetch user.', error: error.message });
  }
};

// ─────────────────────────────────────────────
// 🔓 Logout (stateless token based logout)
// ─────────────────────────────────────────────
exports.logout = async (req, res) => {
  try {
    res.status(200).json({ status: 'success', message: 'Logged out successfully.' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Logout failed.', error: error.message });
  }
};

// ─────────────────────────────────────────────
// ✉️ Send OTP
// ─────────────────────────────────────────────
exports.sendOTP = async (req, res) => {
  try {
    const { email, purpose } = req.body;
    if (!email || !purpose) {
      return res.status(400).json({ status: 'fail', message: 'Email and purpose are required.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ status: 'fail', message: 'User not found.' });
    }

    const otp = secureOTP();
    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

    await Otp.findOneAndDelete({ email });

    await new Otp({
      email,
      otp: hashedOtp,
      purpose,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });
    console.log('📅 OTP expires at:', optvalue); // Debugging: Log the expiration time
    await optvalue.save();
    console.log('🔑 OTP generated:', otp); // Debugging: Log the OTP
    await sendOTPEmail(email ,otp);
    
    }).save();

    await sendOTPEmail(email, otp);

    res.status(200).json({ status: 'success', message: 'OTP sent successfully.' });
  } catch (error) {
    console.error('[Send OTP Error]', error);
    res.status(500).json({ status: 'error', message: 'Failed to send OTP', error: error.message });
  }
};

// ─────────────────────────────────────────────
// ✅ Verify OTP
// ─────────────────────────────────────────────
exports.verifyOTP = async (req, res) => {
  try {
    console.log('🔍 Verifying OTP for email:', req.body.email);
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ status: 'fail', message: 'Email and OTP are required.' });
    }
    console.log('🔑 Received OTP:', otp); // Debugging: Log the received OTP
    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');
    const existingOtp = await Otp.findOne({
      email,
      otp: hashedOtp,
      expiresAt: { $gt: Date.now() },
    });
    console.log('🔒 Hashed OTP for verification:', hashedOtp); // Debugging: Log the hashed OTP
    console.log('🔍 Existing OTP found:', existingOtp); // Debugging: Log the existing OTP

   
    const sanitizedOtp = otp.trim().toLowerCase();
    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');
     console.log('[🔍 Email]', email);
    console.log('[🔍 OTP]', otp);
    console.log('[🔍 Sanitized OTP]', sanitizedOtp);
    console.log('[🔍 Hashed OTP]', hashedOtp);
    const existingOtp = await Otp.findOne({
      email,
      

    });

    if (!existingOtp) {
      return res.status(400).json({ status: 'fail', message: 'Invalid or expired OTP.' });
    }

    res.status(200).json({ status: 'success', message: 'OTP verified.' });
  } catch (error) {
    console.error('[Verify OTP Error]', error);
    res.status(500).json({ status: 'error', message: 'Failed to verify OTP', error: error.message });
  }
};

// ─────────────────────────────────────────────
// 🔁 Forgot Password
// ─────────────────────────────────────────────
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ status: 'fail', message: 'Email is required.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ status: 'fail', message: 'User not found.' });
    }

    const otp = secureOTP();
    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

    await Otp.findOneAndDelete({ email });

    await new Otp({
      email,
      otp: hashedOtp,
      purpose: 'forgot-password',
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    }).save();

    await sendOTPEmail(email, otp);

    res.status(200).json({ status: 'success', message: 'OTP sent to email for password reset.' });
  } catch (error) {
    console.error('[Forgot Password Error]', error);
    res.status(500).json({ status: 'error', message: 'Failed to send forgot password OTP', error: error.message });
  }
// Inside authController.js
exports.forgotPassword = async (req, res) => {
  res.status(501).json({ message: 'Not implemented yet.' });
};

// ─────────────────────────────────────────────
// 🔁 Reset Password
// ─────────────────────────────────────────────
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, password } = req.body;
    if (!email || !otp || !password) {
      return res.status(400).json({ status: 'fail', message: 'Email, OTP, and new password are required.' });
    }

    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

    const validOtp = await Otp.findOne({
      email,
      otp: hashedOtp,
      expiresAt: { $gt: Date.now() },
    });

    if (!validOtp) {
      return res.status(400).json({ status: 'fail', message: 'Invalid or expired OTP.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ status: 'fail', message: 'User not found.' });
    }

    user.password = await bcrypt.hash(password, 12);
   
    user.password = password;
    await user.save();

    await Otp.deleteMany({ email });
    await sendResetPasswordEmail(email);

    res.status(200).json({ status: 'success', message: 'Password has been reset successfully.' });
  } catch (error) {
    console.error('[Reset Password Error]', error);
    res.status(500).json({ status: 'error', message: 'Failed to reset password', error: error.message });
  }
};
