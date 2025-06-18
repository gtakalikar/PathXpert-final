const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  phoneNumber: {
    type: String,
    trim: true
  },
  otp: {
    type: String,
    required: [true, 'OTP is required']
  },
  type: {
    type: String,
    enum: ['email', 'sms'],
    default: 'email' // 👈 now it assumes 'email' if you don’t provide it
  },
  createdAt: { 
    type: Date, 
    default: () => new Date(Date.now() + 5 * 60 * 1000) // THIS is what you check during verify!
    
    
  }
}, {
  timestamps: true
});

otpSchema.index({ email: 1, otp: 1 });
otpSchema.index({ phoneNumber: 1, otp: 1 });

otpSchema.pre('validate', function(next) {
  if (!this.email && !this.phoneNumber) {
    this.invalidate('email', 'Either email or phoneNumber is required');
  }
  if (this.email && this.phoneNumber) {
    this.invalidate('email', 'Only one of email or phoneNumber should be provided');
  }
  next();
});

const Otp = mongoose.model('Otp', otpSchema);

module.exports = Otp;
