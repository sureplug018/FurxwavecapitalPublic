const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  number: {
    type: Number,
    required: [true, 'A contact must have a number'],
  },
});

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
