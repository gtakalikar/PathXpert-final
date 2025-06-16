// 📦 Required modules
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');
const Otp = require('../models/Otp');
const generateOTP = require('../utils/generateOTP');
const sendOTPSMS = require('../utils/sendSMS');
const bcrypt = require('bcrypt');
const { sendOTPEmail, sendResetPasswordEmail } = require('../utils/emailService');
const crypto = require('crypto');
const admin = require('../config/firebase');
// 📦 Add at top if not already
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
// 🔐 JWT Token Generator
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

// 📝 REGISTER
const register = async (req, res, next) => {
  try {
    const {
      username,
      email,
      password,
      mobile,
      emergencyContact,
      favRoutes = [],
      recentRoutes = [],
      sosHistory = []
    } = req.body;

    if (!username || !email || !password) {
      return next(new AppError('username, email, and password are required', 400));
    }

    const cleanedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({ email: cleanedEmail });
    if (existingUser) return next(new AppError('User already exists', 400));

    const user = await User.create({
      username,
      email: cleanedEmail,
      password,
      mobile,
      emergencyContact,
      favRoutes,
      recentRoutes,
      sosHistory
    });

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        mobile: user.mobile,
        emergencyContact: user.emergencyContact,
        favRoutes: user.favRoutes,
        recentRoutes: user.recentRoutes
      }
    });
  } catch (error) {
    next(error);
  }
};

// 🔑 LOGIN
const login = async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const { password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ status: 'fail', message: 'Please provide both email and password' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    user.password = undefined;

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      token,
      user
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Login failed', error: error.message });
  }
};

// 👤 GET CURRENT USER
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return next(new AppError('User not found', 404));

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        mobile: user.mobile,
        emergencyContact: user.emergencyContact,
        favRoutes: user.favRoutes,
        recentRoutes: user.recentRoutes
      }
    });
  } catch (error) {
    next(error);
  }
};

// 🚪 LOGOUT
const logout = async (req, res) => {
  try {
    res.json({ message: 'Logged out successfully 👋' });
  } catch (error) {
    res.status(500).json({ error: 'Error logging out', details: error.message });
  }
};

// 📤 SEND OTP
const sendOTP = async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const { phoneNumber } = req.body;

    if (!email && !phoneNumber) {
      return res.status(400).json({ status: 'fail', message: 'Please provide either email or phoneNumber' });
    }

    if (email && phoneNumber) {
      return res.status(400).json({ status: 'fail', message: 'Only one of email or phoneNumber should be provided' });
    }

    const otp = generateOTP();
    const type = email ? 'email' : 'sms';

    await Otp.create({ email, phoneNumber, otp, type, expiresAt: Date.now() + 5 * 60 * 1000 });

    if (email) await sendOTPEmail(email, otp);
    else await sendOTPSMS(phoneNumber, otp);

    res.status(200).json({ status: 'success', message: `OTP sent via ${type}`, type });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to send OTP', error: error.message });
  }
};

// ✅ VERIFY OTP
const verifyOTP = async (req, res) => {
  try {
    const { email, phoneNumber, otp } = req.body;

    if (!otp || (!email && !phoneNumber)) {
      return res.status(400).json({ status: 'fail', message: 'OTP and either email or phoneNumber required' });
    }

    const query = email ? { email, otp, expiresAt: { $gt: Date.now() } } : { phoneNumber, otp, expiresAt: { $gt: Date.now() } };
    const validOtp = await Otp.findOne(query);

    if (!validOtp) {
      return res.status(400).json({ status: 'fail', message: 'Invalid or expired OTP' });
    }

    await Otp.deleteMany(email ? { email } : { phoneNumber });

    res.status(200).json({ status: 'success', message: 'OTP verified successfully', type: validOtp.type });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'OTP verification failed', error: error.message });
  }
};

// 📧 FORGOT PASSWORD
const forgotPassword = async (req, res, next) => {
  const cleanedEmail = req.body.email?.trim().toLowerCase();
  if (!cleanedEmail) return next(new AppError('Email is required', 400));

  const user = await User.findOne({ email: { $regex: new RegExp(`^${cleanedEmail}$`, 'i') } });
  if (!user) return next(new AppError('Email not found in our records', 404));

  const resetToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  user.passwordResetToken = hashedToken;
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  await user.save({ validateBeforeSave: false });

  const resetURL = `http://your-app/reset-password/${resetToken}`;
  await sendResetPasswordEmail(user.email, resetURL);

  res.status(200).json({ status: 'success', message: 'Reset link sent to your email' });
};

// 🔁 RESET PASSWORD
const resetPassword = async (req, res, next) => {
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  if (!user) return next(new AppError('Token is invalid or has expired', 400));

  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  const token = generateToken(user);
  res.status(200).json({ status: 'success', token });
};
// 🔓 GOOGLE LOGIN
const googleLogin = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) return res.status(400).json({ message: 'No ID token provided' });

    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID, // or paste directly
    });

    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        username: name,
        email,
        profilePicture: picture,
        authType: 'google',
        password: crypto.randomBytes(16).toString('hex') // random pw since you won’t use it
      });
    }

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: 'Google login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture
      }
    });
  } catch (error) {
    console.error('[Google Login Error]', error);
    res.status(401).json({ message: 'Invalid Google token' });
  }
};



// 🌟 EXPORTS
module.exports = {
  login,
  register,
  getMe,
  logout,
  sendOTP,
  verifyOTP,
  forgotPassword,
  resetPassword,
  googleLogin
};
