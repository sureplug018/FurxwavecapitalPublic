const express = require('express');
const authController = require('./../controllers/authController');
const supportController = require('./../controllers/supportController');

const router = express.Router();

router
  .route('/user')
  .post(authController.protect, supportController.createSupport);

router
  .route('/')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    supportController.getAllSupports,
  );

router
  .route('/reply/:supportId')
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    supportController.replySupport,
  );

router
  .route('/sendMail/user')
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    supportController.forwardAnEmail,
  );

module.exports = router;
