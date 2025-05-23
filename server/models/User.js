const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  profilePicture: {
    type: String
  },
  dateJoined: {
    type: Date,
    default: Date.now
  },
  settings: {
    defaultTimeframe: {
      type: String,
      default: 'Daily'
    },
    defaultChartType: {
      type: String,
      default: 'Candlestick'
    },
    timezone: {
      type: String,
      default: 'UTC'
    },
    notificationsEnabled: {
      type: Boolean,
      default: true
    }
  }
}, { timestamps: true });

// Password hashing middleware
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to check password
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);