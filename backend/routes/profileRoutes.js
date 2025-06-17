// routes/profileRoutes.js

const express = require('express');
const { getProfile, updateProfile } = require('../controllers/profileController');
const { auth} = require('../middleware/auth');

const router = express.Router();

router.get('/me', auth, getProfile);
router.put('/me', auth, updateProfile);

module.exports = router;
