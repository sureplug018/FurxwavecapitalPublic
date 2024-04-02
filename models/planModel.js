const mongoose = require('mongoose');

const plansSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A plan must have a name'],
    unique: true,
    trim: true,
  },
  min: {
    type: Number,
    required: [true, 'A plan must have a minimum deposit'],
  },
  max: {
    type: Number,
    required: [true, 'A plan must have a maximum deposit'],
  },
  roi: {
    type: Number,
    required: [true, 'A plan must have a roi'],
  },
  duration: {
    type: Number,
    required: [true, 'A plan must have a duration'],
  },
});

const Plan = mongoose.model('Plan', plansSchema);

module.exports = Plan;
