
// controllers/notificationController.js
const Notification = require('../models/Notification');

exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user.id; // assuming middleware sets req.user

    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      notifications,
    });
  } catch (error) {
    console.error('💥 Error fetching notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};

