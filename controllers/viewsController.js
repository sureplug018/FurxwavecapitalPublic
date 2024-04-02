const Plan = require('../models/planModel');
const Wallet = require('../models/walletsModel');
const Support = require('../models/supportModel');
const Investment = require('../models/investmentModel');
const Reply = require('../models/repliedSupportsModel');
const User = require('../models/userModel');
const Transaction = require('../models/transactionsModel');
const Contact = require('../models/contactInfoModel');

exports.getOverView = async (req, res) => {
  try {
    const user = res.locals.user;
    const plans = await Plan.find().sort({ min: 1 });
    res.status(200).render('index', {
      title: 'Home',
      plans,
      user,
      req,
    });
  } catch (err) {
    res.status(500).render('error', {
      title: 'Error',
      message: 'Something went wrong.',
    });
  }
};

exports.about = async (req, res) => {
  try {
    const user = res.locals.user;
    res.status(200).render('about', {
      title: 'About',
      user,
    });
  } catch (err) {
    res.status(500).render('error', {
      title: 'Error',
      message: 'Something went wrong.',
    });
  }
};

exports.contact = async (req, res) => {
  try {
    const user = res.locals.user;
    const contacts = await Contact.find();
    res.status(200).render('contact', {
      title: 'Contact',
      user,
      contacts,
    });
  } catch (err) {
    res.status(500).render('error', {
      title: 'Error',
      message: 'Something went wrong.',
    });
  }
};

exports.faq = async (req, res) => {
  try {
    const user = res.locals.user;
    res.status(200).render('faq', {
      title: "Faq's",
      user,
    });
  } catch (err) {
    res.status(500).render('error', {
      title: 'Error',
      message: 'Something went wrong.',
    });
  }
};

exports.login = async (req, res) => {
  try {
    const user = res.locals.user;
    res.status(200).render('login', {
      title: 'Login',
      user,
    });
  } catch (err) {
    res.status(500).render('error', {
      title: 'Error',
      message: 'Something went wrong.',
    });
  }
};

exports.signup = async (req, res) => {
  try {
    const user = res.locals.user;
    res.status(200).render('signup', {
      title: 'Signup',
      user,
    });
  } catch (err) {
    res.status(500).render('error', {
      title: 'Error',
      message: 'Something went wrong.',
    });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const user = res.locals.user;
    res.status(200).render('forgotPassword', {
      title: 'Forgot password',
      user,
    });
  } catch (err) {
    res.status(500).render('error', {
      title: 'Error',
      message: 'Something went wrong.',
    });
  }
};

exports.adminDashboard = async (req, res) => {
  try {
    const user = res.locals.user;
    if (user) {
      const users = await User.find();
      const pendingDeposits = await Transaction.find({
        status: 'pending',
        type: 'deposit',
      });
      const pendingWithdrawals = await Transaction.find({
        status: 'pending',
        type: 'withdrawal',
      });
      const totalDeposits = await Transaction.find({
        status: 'confirmed',
        type: 'deposit',
      });
      const activeInvestments = await Investment.find({
        status: 'active',
      });
      const totalWithdrawals = await Transaction.find({
        status: 'confirmed',
        type: 'withdrawal',
      });
      const pendingSupports = await Support.find({
        status: 'pending',
      });
      const transactions = await Transaction.find().populate('user');
      res.status(200).render('admin-dashboard', {
        title: 'Admin dashboard',
        user,
        users,
        pendingDeposits,
        pendingWithdrawals,
        activeInvestments,
        totalDeposits,
        totalWithdrawals,
        transactions,
        pendingSupports,
      });
    }

    if (!user) {
      res.status(302).redirect('admin-login');
    }
  } catch (err) {
    res.status(500).render('error', {
      title: 'Error',
      message: 'Something went wrong.',
    });
  }
};

exports.userWithdrawals = async (req, res) => {
  try {
    const user = res.locals.user;
    if (user) {
      const withdrawals = await Transaction.find({
        user: req.user.id,
        type: 'withdrawal',
      });
      res.status(200).render('userWithdrawals', {
        title: 'User withdrawals',
        user,
        withdrawals,
      });
    }
    if (!user) {
      res.status(302).redirect('login');
    }
  } catch (err) {
    res.status(500).render('error', {
      title: 'Error',
      message: 'Something went wrong.',
    });
  }
};

exports.adminProfile = async (req, res) => {
  try {
    const user = res.locals.user;
    if (user) {
      res.status(200).render('admin-profile', {
        title: 'Admin profile',
        user,
      });
    }
    if (!user) {
      res.status(302).redirect('admin-login');
    }
  } catch (err) {
    res.status(500).render('error', {
      title: 'Error',
      message: 'Something went wrong.',
    });
  }
};

exports.depositDirect = async (req, res) => {
  try {
    const user = res.locals.user;
    if (user) {
      res.status(200).render('deposit-direct', {
        title: 'Direct deposit',
        user,
      });
    }
    if (!user) {
      res.status(302).redirect('login');
    }
  } catch (err) {
    res.status(500).render('error', {
      title: 'Error',
      message: 'Something went wrong.',
    });
  }
};

exports.invest = async (req, res) => {
  try {
    const user = res.locals.user;
    if (user) {
      const plans = await Plan.find().sort({ min: 1 }).exec();
      res.status(200).render('invest', {
        title: 'Invest',
        user,
        plans,
      });
    }
    if (!user) {
      return res.redirect('/login'); 
    }
  } catch (err) {
    res.status(500).render('error', {
      title: 'Error',
      message: 'Something went wrong.',
    });
  }
};

exports.investments = async (req, res) => {
  try {
    const user = res.locals.user;
    if (user) {
      const investments = await Investment.find().populate('user', 'plan');
      res.status(200).render('investments', {
        title: 'Investments',
        user,
        investments,
      });
    }
    if (!user) {
      res.status(302).redirect('admin-login');
    }
  } catch (err) {
    res.status(500).render('error', {
      title: 'Error',
      message: 'Something went wrong.',
    });
  }
};

exports.makeDeposit = async (req, res) => {
  try {
    const user = res.locals.user;
    if (user) {
      const wallets = await Wallet.find();
      res.status(200).render('make-deposit', {
        title: 'Deposit',
        user,
        wallets,
      });
    }
    if (!user) {
      res.status(302).redirect('login');
    }
  } catch (err) {
    res.status(500).render('error', {
      title: 'Error',
      message: 'Something went wrong.',
    });
  }
};

exports.makeWithdrawal = async (req, res) => {
  try {
    const user = res.locals.user;
    if (user) {
      const wallets = await Wallet.find();
      res.status(200).render('make-withdrawal', {
        title: 'Withdrawal',
        user,
        wallets,
      });
    }
    if (!user) {
      res.status(302).redirect('login');
    }
  } catch (err) {
    res.status(500).render('error', {
      title: 'Error',
      message: 'Something went wrong.',
    });
  }
};

exports.plans = async (req, res) => {
  try {
    const user = res.locals.user;
    if (user) {
      const plans = await Plan.find().sort({ min: 1 }).exec();
      res.status(200).render('plans', {
        title: 'Plans',
        user,
        plans,
      });
    }
    if (!user) {
      res.status(302).redirect('admin-login');
    }
  } catch (err) {
    res.status(500).render('error', {
      title: 'Error',
      message: 'Something went wrong.',
    });
  }
};

exports.addPlan = async (req, res) => {
  try {
    const user = res.locals.user;
    if (user) {
      res.status(200).render('plans-add', {
        title: 'Add plan',
        user,
      });
    }
    if (!user) {
      res.status(302).redirect('admin-login');
    }
  } catch (err) {
    res.status(500).render('error', {
      title: 'Error',
      message: 'Something went wrong.',
    });
  }
};

exports.deletePlan = async (req, res) => {
  try {
    const user = res.locals.user;
    if (user) {
      const plans = await Plan.find().sort({ min: 1 }).exec();
      res.status(200).render('plans-delete', {
        title: 'Delete plan',
        user,
        plans,
      });
    }
    if (!user) {
      res.status(302).redirect('admin-login');
    }
  } catch (err) {
    res.status(500).render('error', {
      title: 'Error',
      message: 'Something went wrong.',
    });
  }
};

exports.replySupport = async (req, res) => {
  try {
    const user = res.locals.user;
    if (user) {
      res.status(200).render('replySupport', {
        title: 'Reply support',
        user,
      });
    }
    if (!user) {
      res.status(302).redirect('admin-login');
    }
  } catch (err) {
    res.status(500).render('error', {
      title: 'Error',
      message: 'Something went wrong.',
    });
  }
};

exports.sendMail = async (req, res) => {
  try {
    const user = res.locals.user;
    if (user) {
      res.status(200).render('send-mails', {
        title: 'Send mail',
        user,
      });
    }
    if (!user) {
      res.status(302).redirect('admin-login');
    }
  } catch (err) {
    console.log(err);
    res.status(500).render('error', {
      title: 'Error',
      message: 'Something went wrong.',
    });
  }
};

exports.sentMail = async (req, res) => {
  try {
    const user = res.locals.user;
    if (user) {
      const replies = await Reply.find();
      res.status(200).render('sent-mails', {
        title: 'Sent mails',
        user,
        replies,
      });
    }
    if (!user) {
      res.status(302).redirect('admin-login');
    }
  } catch (err) {
    res.status(500).render('error', {
      title: 'Error',
      message: 'Something went wrong.',
    });
  }
};

exports.sendSupport = async (req, res) => {
  try {
    const user = res.locals.user;
    if (user) {
      res.status(200).render('support', {
        title: 'Support',
        user,
      });
    }
    if (!user) {
      res.status(302).redirect('admin-login');
    }
  } catch (err) {
    res.status(500).render('error', {
      title: 'Error',
      message: 'Something went wrong.',
    });
  }
};

exports.supports = async (req, res) => {
  try {
    const user = res.locals.user;
    if (user) {
      const supports = await Support.find().populate('userId');
      res.status(200).render('supports', {
        title: 'Supports',
        user,
        supports,
      });
    }
    if (!user) {
      res.status(302).redirect('admin-login');
    }
  } catch (err) {
    console.log(err);
    res.status(500).render('error', {
      title: 'Error',
      message: 'Something went wrong.',
    });
  }
};

exports.userDashboard = async (req, res) => {
  try {
    const user = res.locals.user;
    if (user) {
      const investments = await Investment.find({ user: req.user.id });
      const deposits = await Transaction.find({
        user: req.user.id,
        type: 'deposit',
        status: 'confirmed',
      });
      const withdrawals = await Transaction.find({
        user: req.user.id,
        type: 'withdrawal',
        status: 'confirmed',
      });

      const transactions = await Transaction.find({ user: req.user.id });
      res.status(200).render('user-dashboard', {
        title: 'User dashboard',
        user,
        investments,
        deposits,
        withdrawals,
        transactions,
      });
    }
    if (!user) {
      res.status(302).redirect('login');
    }
  } catch (err) {
    res.status(500).render('error', {
      title: 'Error',
      message: 'Something went wrong.',
    });
  }
};

exports.userDeposits = async (req, res) => {
  try {
    const user = res.locals.user;
    if (user) {
      const deposits = await Transaction.find({
        user: req.user.id,
        type: 'deposit',
      });
      res.status(200).render('user-deposits', {
        title: 'User deposits',
        user,
        deposits,
      });
    }
    if (!user) {
      res.status(302).redirect('login');
    }
  } catch (err) {
    res.status(500).render('error', {
      title: 'Error',
      message: 'Something went wrong.',
    });
  }
};

exports.userProfile = async (req, res) => {
  try {
    const user = res.locals.user;
    if (user) {
      res.status(200).render('user-profile', {
        title: 'User profile',
        user,
      });
    }
    if (!user) {
      res.status(302).redirect('login');
    }
  } catch (err) {
    res.status(500).render('error', {
      title: 'Error',
      message: 'Something went wrong.',
    });
  }
};

exports.userInvestments = async (req, res) => {
  try {
    const user = res.locals.user;
    if (user) {
      const investments = await Investment.find({ user: req.user.id }).populate(
        'plan',
      );
      res.status(200).render('userInvestments', {
        title: 'User inestments',
        user,
        investments,
      });
    }
    if (!user) {
      res.status(302).redirect('login');
    }
  } catch (err) {
    res.status(500).render('error', {
      title: 'Error',
      message: 'Something went wrong.',
    });
  }
};

exports.wallets = async (req, res) => {
  try {
    const user = res.locals.user;
    if (user) {
      const wallets = await Wallet.find();

      res.status(200).render('wallets', {
        title: 'Wallets',
        wallets,
        user,
      });
    }
    if (!user) {
      res.status(302).redirect('admin-login');
    }
  } catch (err) {
    res.status(500).render('error', {
      title: 'Error',
      message: 'Something went wrong.',
    });
  }
};

exports.addWallet = async (req, res) => {
  try {
    const user = res.locals.user;
    if (user) {
      res.status(200).render('wallets-add', {
        title: 'Add wallets',
        user,
      });
    }
    if (!user) {
      res.status(302).redirect('admin-login');
    }
  } catch (err) {
    res.status(500).render('error', {
      title: 'Error',
      message: 'Something went wrong.',
    });
  }
};

exports.deleteWallet = async (req, res) => {
  try {
    const user = res.locals.user;
    if (user) {
      const wallets = await Wallet.find();
      res.status(200).render('wallets-delete', {
        title: 'Delete wallet',
        user,
        wallets,
      });
    }
    if (!user) {
      res.status(302).redirect('admin-login');
    }
  } catch (err) {
    res.status(500).render('error', {
      title: 'Error',
      message: 'Something went wrong.',
    });
  }
};

exports.deposits = async (req, res) => {
  try {
    const user = res.locals.user;
    if (user) {
      const deposits = await Transaction.find({ type: 'deposit' }).populate(
        'user',
      );

      res.status(200).render('deposits', {
        title: 'Deposits',
        user,
        deposits,
      });
    }
    if (!user) {
      res.status(302).redirect('admin-login');
    }
  } catch (err) {
    res.status(500).render('error', {
      title: 'Error',
      message: 'Something went wrong.',
    });
  }
};

exports.users = async (req, res) => {
  try {
    const user = res.locals.user;
    if (user) {
      const users = await User.find();
      res.status(200).render('users', {
        title: 'Users',
        user,
        users,
      });
    }
    if (!user) {
      res.status(302).redirect('admin-login');
    }
  } catch (err) {
    res.status(500).render('error', {
      title: 'Error',
      message: 'Something went wrong.',
    });
  }
};

exports.withdrawals = async (req, res) => {
  try {
    const user = res.locals.user;
    if (user) {
      const withdrawals = await Transaction.find({
        type: 'withdrawal',
      }).populate('user');
      res.status(200).render('withdrawals', {
        title: 'Withdrawals',
        user,
        withdrawals,
      });
    }
    if (!user) {
      res.status(302).redirect('admin-login');
    }
  } catch (err) {
    res.status(500).render('error', {
      title: 'Error',
      message: 'Something went wrong.',
    });
  }
};

exports.adminLogin = async (req, res) => {
  try {
    const user = res.locals.user;
    res.status(200).render('login-admin', {
      title: 'Admin login',
      user,
    });
  } catch (err) {
    res.status(500).render('error', {
      title: 'Error',
      message: 'Something went wrong.',
    });
  }
};

exports.signupSuccess = async (req, res) => {
  try {
    const user = res.locals.user;
    res.status(200).render('sent-confirmation-link', {
      title: 'Signup success',
      user,
    });
  } catch (err) {
    res.status(500).render('error', {
      title: 'Error',
      message: 'Something went wrong.',
    });
  }
};

exports.sentResetLink = async (req, res) => {
  try {
    const user = res.locals.user;
    res.status(200).render('sent-reset-link', {
      title: 'Sent reset link',
      user,
    });
  } catch (err) {
    res.status(500).render('error', {
      title: 'Error',
      message: 'Something went wrong.',
    });
  }
};

exports.confirmedEmail = async (req, res) => {
  try {
    const user = res.locals.user;
    res.status(200).render('signup-success', {
      title: 'Email confirmed',
      user,
    });
  } catch (err) {
    res.status(500).render('error', {
      title: 'Error',
      message: 'Something went wrong.',
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const user = res.locals.user;
    res.status(200).render('resetPassword', {
      title: 'Reset password',
      user,
    });
  } catch (err) {
    res.status(500).render('error', {
      title: 'Error',
      message: 'Something went wrong.',
    });
  }
};

exports.contactList = async (req, res) => {
  try {
    const user = res.locals.user;
    if (user) {
      const contacts = await Contact.find();
      res.status(200).render('contacts', {
        title: 'Contacts',
        user,
        contacts,
      });
    }
    if (!user) {
      res.status(302).redirect('admin-login');
    }
  } catch (err) {
    res.status(500).render('error', {
      title: 'Error',
      message: 'Something went wrong.',
    });
  }
};

exports.addContact = async (req, res) => {
  try {
    const user = res.locals.user;
    if (user) {
      res.status(200).render('contact-add', {
        title: 'Add contact',
        user,
      });
    }
    if (!user) {
      res.status(302).redirect('admin-login');
    }
  } catch (err) {
    res.status(500).render('error', {
      title: 'Error',
      message: 'Something went wrong.',
    });
  }
};

exports.deleteContact = async (req, res) => {
  try {
    const user = res.locals.user;
    if (user) {
      const contacts = await Contact.find();
      res.status(200).render('contact-delete', {
        title: 'Delete contacts',
        user,
        contacts,
      });
    }
    if (!user) {
      res.status(302).redirect('admin-login');
    }
  } catch (err) {
    res.status(500).render('error', {
      title: 'Error',
      message: 'Something went wrong.',
    });
  }
};

exports.withdrawToBank = async (req, res) => {
  try {
    const user = res.locals.user;
    if (user) {
      res.status(200).render('userWithdrawalToBank', {
        title: 'Withdrawal',
        user,
      });
    }
    if (!user) {
      res.status(302).redirect('login');
    }
  } catch (err) {
    res.status(500).render('error', {
      title: 'Error',
      message: 'Something went wrong.',
    });
  }
};

exports.error = async (req, res) => {
  try {
    res.status(404).render('error', {
      title: 'Error',
    });
  } catch (err) {
    res.status(500).render('error', {
      title: 'Error',
      message: 'Something went wrong.',
    });
  }
};
