const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format'],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    profile: {
      firstName: String,
      lastName: String,
      avatar: String,
    },
    subscription: {
      tier: {
        type: String,
        enum: ['free', 'pro', 'enterprise'],
        default: 'free',
      },
      expiresAt: Date,
    },
    lastLogin: Date,
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.index({ email: 1 });
userSchema.index({ 'subscription.expiresAt': 1 }, { sparse: true });

module.exports = mongoose.model('User', userSchema);