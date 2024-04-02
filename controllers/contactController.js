const Contact = require('../models/contactInfoModel');

exports.addContact = async (req, res) => {
  try {
    const newNumber = await Contact.create(req.body);

    res.status(200).json({
      status: 'success',
      data: {
        newNumber,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.editNumber = async (req, res) => {
  try {
    const phoneNumber = req.params.id;
    const number = await Contact.findByIdAndUpdate(phoneNumber, {
      number: req.body.number,
    });

    res.status(200).json({
      status: 'success',
      data: {
        number,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.getNumbers = async (req, res) => {
  try {
    const number = await Contact.find();
    res.status(200).json({
      status: 'success',
      data: {
        number,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.deleteContact = async (req, res) => {
  try {
    const number = await Contact.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: {
        number,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};
