
const express = require('express');
const router = express.Router();
const { getTrafficInfo } = require('../controllers/trafficController');

// POST version (expects req.body)
router.post('/', getTrafficInfo);

// GET version (expects req.query)
router.get('/', (req, res) => {
  const { latitude, longitude } = req.query;

  // Manually mimic POST behavior
  req.body = { latitude: parseFloat(latitude), longitude: parseFloat(longitude) };
  return getTrafficInfo(req, res);
});

module.exports = router;
