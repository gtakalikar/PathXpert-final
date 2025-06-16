
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
    unique: true,
    minlength: [3, 'Name must be at least 3 characters'],
    maxlength: [50, 'Name cannot be more than 50 characters']
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
    default: null // for Google users
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
  mobile: {
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
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// 🔐 Hash password before save (only for local auth)
UserSchema.pre('save', async function(next) {
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

// 🔍 Compare password
UserSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) throw new Error('Password not set for this user');
  return await bcrypt.compare(candidatePassword, this.password);
};

// 🔑 Generate JWT
UserSchema.methods.generateAuthToken = function() {
  return jwt.sign(
    {
      id: this._id,
      email: this.email,
      role: this.role
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '1d' }
  );
};

// 💎 Virtual full name (in case you add firstName + lastName later)
UserSchema.virtual('fullName').get(function() {
  return this.username;
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
