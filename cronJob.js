/*const mongoose = require('mongoose');*/
const cron = require('node-cron');
const User = require('./models/userModel');
const Plan = require('./models/planModel');
const Investment = require('./models/investmentModel');

// Function to delete unconfirmed users after a specific time
async function deleteUnconfirmedUsers() {
  try {
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

    const unconfirmedUsers = await User.find({
      confirmed: false,
      createdAt: { $lte: tenMinutesAgo },
    });

    for (const user of unconfirmedUsers) {
      await User.deleteOne({ _id: user._id });
      console.log(`Deleted unconfirmed user with ID: ${user._id}`);
    }
  } catch (error) {
    console.error('Error deleting unconfirmed users:', error);
  }
}

async function returnInvestment() {
  try {
    const investments = await Investment.find({ status: 'active' });
    investments.forEach(async (investment) => {
      const plan = await Plan.findById(investment.plan);

      const duration = plan.duration *24 * 60* 60 * 1000; // Duration of investment in milliseconds

      if (Date.now() - investment.date >= duration) {
        // Investment has reached or exceeded its duration
        await Investment.findByIdAndUpdate(investment._id, {
          status: 'ended',
        });

        await User.findByIdAndUpdate(investment.user._id, {
          $inc: {
            balance: investment.amount + (plan.roi / 100) * investment.amount,
          },
        });
        console.log('Investment duration exceeded:', investment);
      }
    });
  } catch (err) {
    console.error('Error returning investment users:', err.message);
  }
}

// Schedule the cron job to run every 10 minutes
module.exports = function () {
  // Schedule the cron job to run every 10 minutes
  cron.schedule('* * * * *', () => {
    deleteUnconfirmedUsers();
    returnInvestment();
  });
};
