const express = require('express');
const authController = require('./../controllers/authController');
const transactionController = require('./../controllers/transactionController');

const router = express.Router({ mergeParams: true });

router
  .route('/deposit')
  .post(authController.protect, transactionController.deposit);

router
  .route('/withdraw')
  .post(authController.protect, transactionController.withdraw);

router
  .route('/confirm-transaction/:id')
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    transactionController.confirmTransaction,
  );

router
  .route('/decline-transaction/:id')
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    transactionController.declineTransaction,
  );

router
  .route('/')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    transactionController.getAllTransactions,
  );

router
  .route('/my-transactions')
  .get(
    authController.protect,
    transactionController.getTransactionsOfCurrentUser,
  );

router
  .route('/:id')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    transactionController.getTransactionsOfAUser,
  );

router
  .route('/direct-deposit')
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    transactionController.directDeposit,
  );
module.exports = router;
