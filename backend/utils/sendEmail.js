const nodemailer = require('nodemailer');

// 💌 Create transporter using Gmail
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || process.env.EMAIL_FROM, // support both
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

// 📧 Send OTP Email
const sendOTPEmail = async (to, otp) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"PathXpert Team" <${process.env.EMAIL_USER || process.env.EMAIL_FROM}>`,
      to,
      replyTo: process.env.EMAIL_USER || process.env.EMAIL_FROM,
      subject: 'Your PathXpert Verification Code',
      text: `Hello,\n\nYour verification code is: ${otp}\n\nThis code is valid for 5 minutes.`,
      html: `
        <html>
        <body style="font-family: Arial, sans-serif; background-color: #ffffff; padding: 20px;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; margin: auto; border: 1px solid #e0e0e0;">
            <tr>
              <td style="padding: 20px;">
                <h2 style="color: #333;">PathXpert Verification Code</h2>
                <p>Hello,</p>
                <p>Your verification code is:</p>
                <p style="font-size: 24px; font-weight: bold; background-color: #f2f2f2; padding: 15px; text-align: center;">${otp}</p>
                <p>This code is valid for 5 minutes.</p>
                <p>If you didn’t request this, no action is needed.</p>
                <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
                <p style="font-size: 12px; color: #888;">This is an automated email. Please do not reply.</p>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`📧 OTP email sent to ${to}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending OTP email:', error);
    throw new Error('Failed to send OTP email');
  }
};

// 🔁 Send Password Reset Email
const sendResetPasswordEmail = async (to, resetLink) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"PathXpert Team" <${process.env.EMAIL_USER || process.env.EMAIL_FROM}>`,
      to,
      replyTo: process.env.EMAIL_USER || process.env.EMAIL_FROM,
      subject: 'Reset Your PathXpert Password',
      text: `Hello,\n\nReset your password using this link:\n${resetLink}\n\nLink is valid for a limited time.`,
      html: `
        <html>
        <body style="font-family: Arial, sans-serif; background-color: #ffffff; padding: 20px;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; margin: auto; border: 1px solid #e0e0e0;">
            <tr>
              <td style="padding: 20px;">
                <h2 style="color: #333;">Reset Your Password</h2>
                <p>Hello,</p>
                <p>Click the button below to reset your password:</p>
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${resetLink}" style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; font-size: 16px; border-radius: 5px;">Reset Password</a>
                </div>
                <p>If you didn’t request this, you can ignore this email.</p>
                <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
                <p style="font-size: 12px; color: #888;">This is an automated email. Please do not reply.</p>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`📧 Password reset email sent to ${to}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending reset password email:', error);
    throw new Error('Failed to send password reset email');
  }
};

module.exports = {
  sendOTPEmail,
  sendResetPasswordEmail,
};
