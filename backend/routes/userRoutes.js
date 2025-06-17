const express = require('express');
const router = express.Router();

const { auth, authorize } = require('../middleware/auth');
const userController = require('../controllers/userController');
const { getTrafficInfo } = require('../controllers/trafficController');

// -------- Traffic Info Route --------
router.post('/traffic', getTrafficInfo);

// -------- Legacy Login Redirect --------
router.post('/login', (req, res) => res.redirect(307, '/api/auth/login'));

// -------- Health-check routes --------
router.get('/test-connection', (req, res) => res.json({ message: 'User routes connected' }));
router.get('/test-users', async (req, res) => {
  const users = await require('../models/User').find();
  res.json(users);
});

// -------- Report History & Stats --------
router.get('/history/:id?', auth, userController.getReportHistory);
router.get('/stats/:id?', auth, userController.getUserStats);

// -------- Profile Routes --------
router.get('/profile', auth, userController.getProfile);
router.put('/profile', auth, userController.updateProfile);

// -------- User Settings --------
router.get('/settings', auth, userController.getSettings);
router.put('/settings', auth, userController.updateSettings);

// -------- Logout --------
router.post('/logout', auth, async (req, res) => {
  res.json({ message: 'Logout successful (token removed on client)' });
});

// -------- Admin-only: list all users --------
router.get('/', auth, authorize('admin'), async (req, res) => {
  try {
    const users = await require('../models/User').find().select('-password');
    res.json({ users });
  } catch (err) {
    console.error('Admin get users error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
