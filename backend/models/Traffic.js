// models/Traffic.js
const mongoose = require('mongoose');

const trafficSchema = new mongoose.Schema({
  signalName: {
    type: String,
    required: true,
  },
  trafficLevel: {
    type: String,
    enum: ['low', 'medium', 'high'],
    required: true,
  },
  status: {
    type: String,
    enum: ['working', 'off', 'damaged'],
    default: 'working',
  },
  location: {
    type: {
      type: String,
      enum: ['Point'], // Required for GeoJSON
      default: 'Point',
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  },
});

// Enable geospatial queries like $near
trafficSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Traffic', trafficSchema);
