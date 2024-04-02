const mongoose = require('mongoose');
const validator = require('validator');

const relpySchema = new mongoose.Schema({
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
    required: [true, 'A reply support must have a subject'],
  },
  message: {
    type: String,
    required: [true, 'A reply must have a message'],
  },
  time: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

// setting value for time using pre save middleware
relpySchema.pre('save', function (next) {
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

const Reply = mongoose.model('Reply', relpySchema);

module.exports = Reply;
