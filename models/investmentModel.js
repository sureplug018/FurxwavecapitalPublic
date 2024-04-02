const mongoose = require('mongoose');
const crypto = require('crypto');

const investmentSchema = new mongoose.Schema({
  trasactionId: String,
  plan: {
    type: mongoose.Schema.ObjectId,
    ref: 'Plan',
    required: [true, 'An investment must have a plan'],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'An investment must have a user'],
  },
  amount: {
    type: Number,
    required: [true, 'An investment must have an amount'],
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  status: {
    type: String,
    enum: ['active', 'ended'],
    default: 'active',
  },
});

investmentSchema.pre('save', function (next) {
  if (!this.trasactionId) {
    this.trasactionId = crypto.randomBytes(10).toString('hex');
  }
  next();
});

investmentSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'plan',
    select: 'name roi duration',
  });
  next();
});

investmentSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'email',
  });
  next();
});

const Investment = mongoose.model('Investment', investmentSchema);

module.exports = Investment;
