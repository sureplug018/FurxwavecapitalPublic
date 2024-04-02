const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const transactionRouter = require('./../routes/transactionRoutes');
const investmentRouter = require('./../routes/investmentRoutes');
const multer = require('multer');

const router = express.Router();

router.use('/:userId/transactions', transactionRouter);
router.use('/:userId/investments', investmentRouter);

router.post('/signup', authController.signup);

const upload = multer({ dest: 'public/img/users' });

router.post('/confirm-email/:token/', authController.confirmEmailBE);

router.post('/login', authController.login);

router.post('/login/admin', authController.loginAdmin);

router.get('/logout', authController.logout);

router.post('/forgotPassword', authController.forgortPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.patch(
  '/updateMyPassword',
  authController.protect,
  authController.updatePassword,
);

// Assuming '/update' is the route where user data can be updated
router.patch(
  '/update',
  authController.protect,
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  authController.updateUserData,
);

router.delete(
  '/deleteUser/:id',
  authController.protect,
  authController.restrictTo('admin'), 
  authController.deleteUser,
);

module.exports = router;
