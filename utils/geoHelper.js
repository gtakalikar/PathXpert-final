/**
 * Calculate the distance between two points using the Haversine formula
 * @param {number} lat1 - Latitude of first point
 * @param {number} lon1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lon2 - Longitude of second point
 * @returns {number} - Distance in kilometers
 */
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return distance;
};

/**
 * Convert degrees to radians
 * @param {number} deg - Degrees
 * @returns {number} - Radians
 */
const deg2rad = (deg) => {
  return deg * (Math.PI / 180);
};

/**
 * Find reports within a certain radius of a point
 * @param {Object} point - The center point {latitude, longitude}
 * @param {number} radiusKm - Radius in kilometers
 * @param {Array} reports - Array of report objects with location property
 * @returns {Array} - Filtered reports within radius
 */
const findReportsWithinRadius = (point, radiusKm, reports) => {
  return reports.filter(report => {
    const distance = calculateDistance(
      point.latitude,
      point.longitude,
      report.location.coordinates[1], // latitude
      report.location.coordinates[0]  // longitude
    );
    return distance <= radiusKm;
  });
};

/**
 * Calculate the bounding box for a point and radius
 * @param {Object} point - The center point {latitude, longitude}
 * @param {number} radiusKm - Radius in kilometers
 * @returns {Object} - Bounding box {minLat, maxLat, minLon, maxLon}
 */
const calculateBoundingBox = (point, radiusKm) => {
  const R = 6371; // Radius of the earth in km
  
  // Angular radius in radians
  const radDist = radiusKm / R;
  
  const radLat = deg2rad(point.latitude);
  const radLon = deg2rad(point.longitude);
  
  const minLat = radLat - radDist;
  const maxLat = radLat + radDist;
  
  let minLon, maxLon;
  
  if (minLat > -Math.PI/2 && maxLat < Math.PI/2) {
    const deltaLon = Math.asin(Math.sin(radDist) / Math.cos(radLat));
    minLon = radLon - deltaLon;
    maxLon = radLon + deltaLon;
    
    if (minLon < -Math.PI) {
      minLon += 2 * Math.PI;
    }
    if (maxLon > Math.PI) {
      maxLon -= 2 * Math.PI;
    }
  } else {
    // Near the poles
    minLat = Math.max(minLat, -Math.PI/2);
    maxLat = Math.min(maxLat, Math.PI/2);
    minLon = -Math.PI;
    maxLon = Math.PI;
  }
  
  return {
    minLat: minLat * 180 / Math.PI,
    maxLat: maxLat * 180 / Math.PI,
    minLon: minLon * 180 / Math.PI,
    maxLon: maxLon * 180 / Math.PI
  };
};

module.exports = {
  calculateDistance,
  findReportsWithinRadius,
  calculateBoundingBox
}; 