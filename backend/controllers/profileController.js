// controllers/profileController.js

const User = require('../models/User');

// GET user profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// UPDATE user profile
const updateProfile = async (req, res) => {
  try {
    const updates = req.body;

    const user = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
      runValidators: true
    }).select('-password');

    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update profile' });
  }
};

module.exports = { getProfile, updateProfile };
