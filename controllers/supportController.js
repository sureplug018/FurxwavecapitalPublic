const Support = require('../models/supportModel');
const Reply = require('../models/repliedSupportsModel');
const nodemailer = require('nodemailer');

exports.createSupport = async (req, res) => {
  try {
    if (!req.body.userId) req.body.userId = req.user.id;
    const newSupport = await Support.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        newSupport,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
    });
  }
};

exports.getAllSupports = async (req, res) => {
  try {
    const supports = await Support.find();
    res.status(200).json({
      status: 'success',
      result: supports.length,
      data: {
        supports,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
    });
  }
};

exports.replySupport = async (req, res) => {
  try {
    let getSupportById;
    if (req.params.supportId)
      getSupportById = await Support.findByIdAndUpdate(req.params.supportId, {
        status: 'replied',
      });

    if (!req.body.email) req.body.email = getSupportById.email;
    const reply = req.body;

    await Reply.create(req.body);

    res.status(200).json({
      status: 'success',
      data: {
        getSupportById,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
    });
  }
};
// const smtpexpressClient = createClient({
//   projectId: process.env.SMTP_PROJECT_ID,
//   projectSecret: process.env.SMTP_PROJECT_SECRET,
// });

exports.forwardAnEmail = async (req, res) => {
  try {
    const { email, subject, message } = req.body;

    await sendEmailNotification(email, subject, message);

    await Reply.create(req.body);

    res.status(200).json({
      status: 'success',
      message: 'Mail sent',
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
    });
  }
};

async function sendEmailNotification(email, subject, message) {
  try {
    // Create a transporter using Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      secure: false,
      port: 587,
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    // Sending email
    const info = await transporter.sendMail({
      from: 'Furxwavecapital@gmail.com' , // Sender's email address
      to: email, // Recipient's email address
      subject: subject, // Email subject
      text: message, // Email message
    });

    return 'Email sent successfully';
  } catch (error) {
    // Handling errors
    console.error(error);
    throw new Error(`Error sending email: ${error.message}`);
  }
}

