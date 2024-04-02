const mongoose = require('mongoose');
const validator = require('validator');

const supportSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A support mail must have a user'],
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    validate: {
      validator: function (value) {
        return validator.isEmail(value);
      },
      message: 'Invalid email address',
    },
  },
  subject: {
    type: String,
    required: [true, 'A support mail must have a subject'],
  },
  message: {
    type: String,
    required: [true, 'A support mail must have a message'],
  },
  status: {
    type: String,
    required: [true, 'A support mail must have a status'],
    enum: ['pending', 'replied'],
    default: 'pending',
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  time: {
    type: String,
  },
});

// setting value for time using pre save middleware
supportSchema.pre('save', function (next) {
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

supportSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'userId',
    select: 'firstName email',
  });
  next();
});

const Support = mongoose.model('Support', supportSchema);

module.exports = Support;
