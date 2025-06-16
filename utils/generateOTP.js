const crypto = require('crypto');

/**
 * Generates a secure OTP of specified length
 * @param {number} length - Length of OTP (default: 6)
 * @returns {string} Generated OTP
 */
function generateOTP(length = 6) {
  // Generate random bytes and convert to hex
  const randomBytes = crypto.randomBytes(length);
  const otp = randomBytes.toString('hex')
    .slice(0, length)
    .toUpperCase();
  
  return otp;
}

module.exports = generateOTP; 