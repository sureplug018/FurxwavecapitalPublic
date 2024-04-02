const Transaction = require('./../models/transactionsModel');
const User = require('./../models/userModel');
const Email = require('./../utilities/email');

exports.deposit = async (req, res) => {
  try {
    if (!req.body.user) req.body.user = req.user.id;

    req.body.type = 'deposit';
    req.body.address = 'null';

    const newTransaction = await Transaction.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        transaction: newTransaction,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.withdraw = async (req, res) => {
  try {
    if (!req.body.user) req.body.user = req.user.id;

    req.body.type = 'withdrawal';
    if (req.user.balance < req.body.amount) {
      return res.status(400).json({
        status: 'fail',
        message: 'Insufficient balance',
      });
    }
    const newTransaction = await Transaction.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        transaction: newTransaction,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.getAllTransactions = async (req, res) => {
  try {
    let filter = {};

    if (req.body.user) filter = { user: req.params.userId };

    const transactions = await Transaction.find(filter);

    res.status(200).json({
      status: 'success',
      result: transactions.length,
      data: {
        transactions,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.confirmTransaction = async (req, res) => {
  try {
    const transactionId = req.params.id;
    const transaction = await Transaction.findByIdAndUpdate(transactionId, {
      status: 'confirmed',
    }).populate('user');

    if (transaction.type === 'deposit') {
      await User.findByIdAndUpdate(transaction.user._id, {
        $inc: { balance: transaction.amount },
      });
    }

    if (transaction.type === 'withdrawal') {
      await User.findByIdAndUpdate(transaction.user._id, {
        $inc: { balance: -transaction.amount },
      });
    }

    res.status(204).json({
      status: 'success',
      data: {
        transaction,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.declineTransaction = async (req, res) => {
  try {
    const transactionId = req.params.id;
    const transaction = await Transaction.findByIdAndUpdate(transactionId, {
      status: 'declined',
    });

    res.status(204).json({
      status: 'success',
      data: {
        transaction,
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

exports.getTransactionsOfCurrentUser = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id });

    res.status(200).json({
      status: 'success',
      result: transactions.length,
      data: {
        transactions,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.getTransactionsOfAUser = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.params.id });

    res.status(200).json({
      status: 'success',
      result: transactions.length,
      data: {
        transactions,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.directDeposit = async (req, res) => {
  try {
    const deposit = req.body;

    const user = await User.findOneAndUpdate(
      { email: deposit.email },
      { $inc: { balance: deposit.amount } },
      { new: true },
    );

    if (!req.body.user) req.body.user = req.user.id;
    req.body.type = 'deposit';
    req.body.address = 'null';
    req.body.wallet = 'null';
    req.body.status = 'confirmed';

    const direct = await Transaction.create(req.body);
    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};
