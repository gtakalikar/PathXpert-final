const User = require('../models/User');
const Otp = require('../models/Otp');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const { secureOTP } = require('../utils/generateOTP'); // updated import 💎
const sendEmail = require('../utils/sendEmail');

// ✨ Send OTP
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

    const otp = secureOTP(); // using secure fancy OTP 💎✨
    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

    await Otp.findOneAndDelete({ email });

    const otpEntry = new Otp({
      email,
      otp: hashedOtp,
      purpose,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    });

    await otpEntry.save();

    await sendEmail(email, 'Your OTP Code', `Use this OTP to reset your password: ${otp}`);

    res.status(200).json({ status: 'success', message: 'OTP sent successfully.' });
  } catch (error) {
    console.error('[Send OTP Error]', error);
    res.status(500).json({ status: 'error', message: 'Failed to send OTP', error: error.message });
  }
};

// ✨ Verify OTP
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ status: 'fail', message: 'Email and OTP are required.' });
    }

    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

    const existingOtp = await Otp.findOne({
      email,
      otp: hashedOtp,
      expiresAt: { $gt: Date.now() },
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

// ✨ Reset Password
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
      expiresAt: { $gt: Date.now() }
    });

    if (!validOtp) {
      return res.status(400).json({ status: 'fail', message: 'Invalid or expired OTP.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ status: 'fail', message: 'User not found.' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    user.password = hashedPassword;
    await user.save();

    await Otp.deleteMany({ email }); // cleanup

    res.status(200).json({ status: 'success', message: 'Password has been reset successfully.' });
  } catch (error) {
    console.error('[Reset Password Error]', error);
    res.status(500).json({ status: 'error', message: 'Failed to reset password', error: error.message });
  }
};
 