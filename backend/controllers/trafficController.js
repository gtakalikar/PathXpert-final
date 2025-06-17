// controllers/trafficController.js
const Traffic = require('../models/Traffic');

exports.getTrafficInfo = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({
        status: 'fail',
        message: 'Missing latitude or longitude',
      });
    }

    console.log('📍 Traffic check for:', latitude, longitude);

    // Find nearby traffic signals within 1km
    const nearbyTraffic = await Traffic.find({
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates: [longitude, latitude] },
          $maxDistance: 1000, // in meters
        },
      },
    });

    let trafficLevel = 'Low';
    if (nearbyTraffic.length > 10) trafficLevel = 'High';
    else if (nearbyTraffic.length > 5) trafficLevel = 'Moderate';

    res.json({
      status: 'success',
      trafficLevel,
      nearbyCount: nearbyTraffic.length,
      radiusMeters: 1000,
      coords: { latitude, longitude },
    });
  } catch (err) {
    console.error('🚨 Traffic backend error:', err);
    res.status(500).json({
      status: 'error',
      message: 'Server error fetching traffic data',
    });
  }
};
