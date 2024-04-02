const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');

const router = express.Router();
router.get('/forgot-password', viewsController.forgotPassword);

router.get('/error', viewsController.error);

router.get('/signup-success', viewsController.signupSuccess);

router.get('/sent-reset-link', viewsController.sentResetLink);

router.get(
  '/email-confirmed/:token',
  authController.confirmEmailFE,
  viewsController.confirmedEmail,
);

router.get('/', authController.isLoggedIn, viewsController.getOverView);

router.get('/about', authController.isLoggedIn, viewsController.about);

router.get('/contact', authController.isLoggedIn, viewsController.contact);

router.get('/Faq', authController.isLoggedIn, viewsController.faq);

router.get('/login', viewsController.login);

router.get('/admin-login', viewsController.adminLogin);

router.get('/resetPassword/:token', viewsController.resetPassword);

router.get('/signup', viewsController.signup);

///////////////////////////////////////////////////
// admin routes

router.use(authController.isLoggedIn);

router.get(
  '/admin-dashboard',
  authController.restrictTo('admin'),
  viewsController.adminDashboard,
);

router.get(
  '/admin-profile',
  authController.restrictTo('admin'),
  viewsController.adminProfile,
);

router.get(
  '/direct-deposit',
  authController.restrictTo('admin'),
  viewsController.depositDirect,
);

router.get(
  '/investments',
  authController.restrictTo('admin'),
  viewsController.investments,
);

router.get('/plans', authController.restrictTo('admin'), viewsController.plans);

router.get(
  '/add-plans',
  authController.restrictTo('admin'),
  viewsController.addPlan,
);

router.get(
  '/delete-plan',
  authController.restrictTo('admin'),
  viewsController.deletePlan,
);

router.get(
  '/reply-support',
  authController.restrictTo('admin'),
  viewsController.replySupport,
);

router.get(
  '/send-mail',
  authController.restrictTo('admin'),
  viewsController.sendMail,
);

router.get(
  '/sent-mails',
  authController.restrictTo('admin'),
  viewsController.sentMail,
);

router.get(
  '/supports',
  authController.restrictTo('admin'),
  viewsController.supports,
);

router.get(
  '/wallets',
  authController.restrictTo('admin'),
  viewsController.wallets,
);

router.get(
  '/add-wallet',
  authController.restrictTo('admin'),
  viewsController.addWallet,
);

router.get(
  '/delete-wallet',
  authController.restrictTo('admin'),
  viewsController.deleteWallet,
);

router.get(
  '/deposits',
  authController.restrictTo('admin'),
  viewsController.deposits,
);

router.get('/users', authController.restrictTo('admin'), viewsController.users);

router.get(
  '/withdrawals',
  authController.restrictTo('admin'),
  viewsController.withdrawals,
);

///////////////////////////////////////////////////
// user routes
router.get(
  '/user-withdrawals',
  // authController.restrictTo('user'),
  viewsController.userWithdrawals,
);

router.get(
  '/invest',
  // authController.restrictTo('user'),
  viewsController.invest,
);

router.get(
  '/deposit',
  // authController.restrictTo('user'),
  viewsController.makeDeposit,
);

router.get(
  '/withdrawal',
  // authController.restrictTo('user'),
  viewsController.makeWithdrawal,
);

router.get(
  '/withdraw/bank',
  // authController.restrictTo('user'),
  viewsController.withdrawToBank,
);

router.get(
  '/support',
  // authController.restrictTo('user'),
  viewsController.sendSupport,
);

router.get(
  '/user-dashboard',
  // authController.restrictTo('user'),
  viewsController.userDashboard,
);

router.get(
  '/user-deposits',
  // authController.restrictTo('user'),
  viewsController.userDeposits,
);

router.get(
  '/user-profile',
  // authController.restrictTo('user'),
  viewsController.userProfile,
);

router.get(
  '/user-investments',
  // authController.restrictTo('user'),
  viewsController.userInvestments,
);

router.get(
  '/contacts',
  authController.restrictTo('admin'),
  viewsController.contactList,
);

router.get(
  '/add-contact',
  authController.restrictTo('admin'),
  viewsController.addContact,
);

router.get(
  '/delete-contact',
  authController.restrictTo('admin'),
  viewsController.deleteContact,
);

module.exports = router;
