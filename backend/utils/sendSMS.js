

const twilio = require('twilio');

// 👇 NEVER hardcode secrets. Use environment variables like a pro.
const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = new twilio(accountSid, authToken);

async function sendOTPSMS(phoneNumber, otp) {
  try {
    const message = await client.messages.create({
      body: `Your OTP is ${otp}`,
      to: phoneNumber,           // ✅ Must be a verified number on Twilio trial
      from: '+1 5752555592'      // ✅ Your Twilio trial number
    });

    console.log('OTP sent successfully:', message.sid);
    return true;
  } catch (error) {
    console.error('Error sending OTP SMS:', error);
    throw new Error('Failed to send OTP SMS');
  }
}

module.exports = sendOTPSMS;
