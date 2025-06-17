const crypto = require('crypto');

/**
 * Generates a secure OTP of specified length using crypto
 * e.g. "A3F8C2"
 */
function secureOTP(length = 6) {
  const randomBytes = crypto.randomBytes(length);
  return randomBytes.toString('hex').slice(0, length).toUpperCase();
}

/**
 * Generates a 6-digit numeric OTP
 * e.g. "483920"
 */
function numericOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

module.exports = {
  secureOTP,
  numericOTP
};
