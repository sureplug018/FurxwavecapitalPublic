const Plan = require('./../models/planModel');

exports.createPlan = async (req, res) => {
  try {
    const newPlan = await Plan.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        plan: newPlan,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.deletePlan = async (req, res) => {
  try {
    await Plan.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      message: 'Successfully deleted plan',
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.getAllPlans = async (req, res) => {
  try {
    const plans = await Plan.find();

    res.status(200).json({
      ststus: 'success',
      result: plans.length,
      data: {
        plans,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.editPlan = async (req, res) => {
  try {
    await Plan.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
      min: req.body.min,
      max: req.body.max,
      roi: req.body.roi,
      duration: req.body.duration
    });

    res.status(200).json({
      status: 'success',
      message: 'successfully edited plan'
    })
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
}

exports.getPlan = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);

    res.status(200).json({
      status: 'success',
      data: {
        plan
      }
    })
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
}