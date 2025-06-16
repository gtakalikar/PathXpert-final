const User = require('../models/User');
const Report = require('../models/Report');

// 💼 Get current user profile (detailed)
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    console.error('getProfile error:', error);
    res.status(500).json({ message: 'Internal server error', details: error.message });
  }
};

// ✏️ Update current user profile
const updateProfile = async (req, res) => {
  try {
    const { name, email, displayName, photoURL } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (email && email !== user.email) {
      const exists = await User.findOne({ email });
      if (exists) {
        return res.status(400).json({ error: 'Email already in use' });
      }
      user.email = email;
    }

    if (name) user.name = name;
    if (displayName) user.displayName = displayName;
    if (photoURL) user.photoURL = photoURL;

    await user.save();
    res.json({ message: 'Profile updated successfully', userId: user._id });
  } catch (error) {
    console.error('updateProfile error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};

// 📜 Get paginated report history
const getReportHistory = async (req, res) => {
  try {
    const targetId = req.params.id || req.user._id;

    if (req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to view another user\'s reports' });
    }

    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit) || 10, 1);
    const { status, type } = req.query;

    const filter = { userId: targetId };
    if (status) filter.status = status;
    if (type) filter.type = type;

    const [reports, total] = await Promise.all([
      Report.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Report.countDocuments(filter)
    ]);

    res.json({
      reports,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('getReportHistory error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};

// 📊 Get user statistics
const getUserStats = async (req, res) => {
  try {
    const targetId = req.params.id || req.user._id;
    if (req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to view another user\'s stats' });
    }

    const [totalReports, reportsByStatus, reportsByType, reportsBySeverity] = await Promise.all([
      Report.countDocuments({ userId: targetId }),
      Report.aggregate([
        { $match: { userId: targetId } },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      Report.aggregate([
        { $match: { userId: targetId } },
        { $group: { _id: '$type', count: { $sum: 1 } } }
      ]),
      Report.aggregate([
        { $match: { userId: targetId } },
        { $group: { _id: '$severity', count: { $sum: 1 } } }
      ])
    ]);

    res.json({ totalReports, reportsByStatus, reportsByType, reportsBySeverity });
  } catch (error) {
    console.error('getUserStats error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};

// 🧠 Get user settings
const getSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('settings');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user.settings);
  } catch (error) {
    console.error('getSettings error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};

// ⚙️ Update user settings
const updateSettings = async (req, res) => {
  try {
    const { darkMode, notifications, mapType } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    user.settings.darkMode = darkMode;
    user.settings.notifications = notifications;
    user.settings.mapType = mapType;

    await user.save();
    res.json({ message: 'Settings updated', settings: user.settings });
  } catch (error) {
    console.error('updateSettings error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};

// 📦 Export everything like a good package
module.exports = {
  getProfile,
  updateProfile,
  getReportHistory,
  getUserStats,
  getSettings,
  updateSettings
};
