const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  googleId: {
    type: String,
    unique: true,
    sparse: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  firstName: {
    type: String,
    trim: true
  },
  lastName: {
    type: String,
    trim: true
  },
  username: {
    type: String,
    trim: true,
    unique: true,
    minlength: [3, 'Name must be at least 3 characters'],
    maxlength: [50, 'Name cannot be more than 50 characters'],
    validate: {
      validator: function (v) {
        return this.authType === 'google' || (v && v.length >= 3);
      },
      message: 'Username is required for local accounts'
    }
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    minlength: [6, 'Password must be at least 6 characters'],
    select: false,
    validate: {
      validator: function (v) {
        return this.authType === 'google' || (v && v.length >= 6);
      },
      message: 'Password is required for local accounts'
    }
  },
  authType: {
    type: String,
    enum: ['google', 'local'],
    default: 'local'
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  phoneno: {
    type: String,
    trim: true
  },
  emergencyContact: {
    type: String,
    trim: true
  },
  sosHistory: [{
    type: Date
  }],
  favRoutes: [{
    from: { type: String, required: true },
    to: { type: String, required: true },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  recentRoutes: [{
    type: String
  }],
  passwordResetToken: String,
  passwordResetExpires: Date,
  profilePicture: {
    type: String,
    default: 'https://example.com/default-profile.png'
  },
  settings: {
    darkMode: { type: Boolean, default: false },
    notifications: { type: Boolean, default: true },
    mapType: { type: String, default: 'standard' }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// 🔐 Password Hashing (only for local auth)
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password') || this.authType === 'google') {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// 🔍 Compare password method
UserSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) throw new Error('Password not set for this user');
  return await bcrypt.compare(candidatePassword, this.password);
};

// 🔑 Generate JWT token method

UserSchema.methods.generateAuthToken = function () {
  console.log('🔐 Using JWT_SECRET:', process.env.JWT_SECRET);
  console.log('⏳ Token Expiry:', process.env.JWT_EXPIRES_IN);

  return jwt.sign(
    {
      id: this._id,
      email: this.email,
      role: this.role
    },
    process.env.JWT_SECRET || 'fallback-secret',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};


// 💎 Full name virtual
UserSchema.virtual('fullName').get(function () {
  return `${this.firstName || ''} ${this.lastName || ''}`.trim();
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
