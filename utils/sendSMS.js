const twilio = require('twilio');

const accountSid = 'AC8694e57d1d0364811a6670bac66b625c';
const authToken = '083008cefa432506a4863295ba914fcd';
const client = new twilio(accountSid, authToken);

async function sendOTPSMS(phoneNumber, otp) {
  try {
    const message = await client.messages.create({
      body: `Your OTP is ${otp}`,
      to: phoneNumber,              // ✅ Must be a VERIFIED number on trial
      from: '+1 5752555592'  // ✅ Your Twilio trial number
    });

    console.log('OTP sent successfully:', message.sid);
    return true;
  } catch (error) {
    console.error('Error sending OTP SMS:', error);
    throw new Error('Failed to send OTP SMS');
  }
}

module.exports = sendOTPSMS;
