const mongoose = require('mongoose');
const { format } = require('date-fns');
const crypto = require('crypto');

const transactionSchema = new mongoose.Schema({
  trasactionId: String,
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'A transaction must have a user'],
  },
  amount: {
    type: Number,
    required: [true, 'A transaction must have an amount'],
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'declined'],
    default: 'pending',
  },
  time: String,
  date: {
    type: Date,
    default: Date.now(),
  },
  type: {
    type: String,
    enum: ['deposit', 'withdrawal'],
  },
  wallet: {
    type: String,
    required: true,
  },
  address: String,
});

// setting value for time using pre save middleware
transactionSchema.pre('save', function (next) {
  if (!this.time) {
    // Set the current time in HH:MM AM/PM format if the timeField is not provided
    const now = new Date();
    const hours = now.getHours() % 12 || 12; // Convert 24-hour format to 12-hour format
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const amOrPm = now.getHours() >= 12 ? 'PM' : 'AM';
    this.time = `${hours}:${minutes} ${amOrPm}`;
  }
  next();
});

transactionSchema.pre('save', function (next) {
  if (!this.trasactionId) {
    this.trasactionId = crypto.randomBytes(10).toString('hex');
  }
  next();
});

transactionSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name email balance',
  });
  next();
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
