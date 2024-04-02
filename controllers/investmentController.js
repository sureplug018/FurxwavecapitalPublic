const Investment = require('./../models/investmentModel');
const Plan = require('./../models/planModel');
const User = require('./../models/userModel');

exports.invest = async (req, res) => {
  try {
    if (!req.body.plan) req.body.plan = req.params.id;
    if (!req.body.user) req.body.user = req.user.id;

    const plan = await Plan.findById(req.params.id);

    if (req.body.amount > req.user.balance) {
      return res.status(400).json({
        status: 'fail',
        message: 'Insuffient balance',
      });
    }

    if (req.body.amount < plan.min) {
      return res.status(400).json({
        status: 'fail',
        message: `Your capital is less than the minimum investment for ${plan.name} plan`,
      });
    }

    if (req.body.amount > plan.max) {
      return res.status(400).json({
        status: 'fail',
        message: `Your capital is greater than maximum investment for ${plan.name} plan`,
      });
    }

    await User.findOneAndUpdate(
      { _id: req.user._id }, // Query criteria to find the user
      { $inc: { balance: -req.body.amount } }, // Update operation to decrement the balance
    );

    const newInvestment = await Investment.create(req.body);

    res.status(200).json({
      status: 'success',
      data: {
        newInvestment,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.getAllInvestments = async (req, res) => {
  try {
    let filter = {};
    if (req.body.user) filter = { user: req.params.userId };

    const investments = await Investment.find(filter);

    res.status(200).json({
      status: 'success',
      result: investments.length,
      data: {
        investments,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.getInvestmentsOfCurrentUser = async (req, res) => {
  try {
    const investments = await Investment.find({ user: req.user.id });

    res.status(200).json({
      status: 'success',
      result: investments.length,
      data: {
        investments,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};
