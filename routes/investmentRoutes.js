const express = require('express');
const authController = require('../controllers/authController');
const investmentController = require('../controllers/investmentController');

const router = express.Router({ mergeParams: true });

router.route('/invest/:id').post(authController.protect, investmentController.invest);

router
  .route('/my-investments')
  .get(
    authController.protect,
    investmentController.getInvestmentsOfCurrentUser,
  );

router
  .route('/')
  .get(authController.protect, investmentController.getAllInvestments);

module.exports = router;
