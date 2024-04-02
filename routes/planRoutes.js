const express = require('express');
const authController = require('../controllers/authController');
const planController = require('../controllers/planController');

const router = express.Router();

router
  .route('/create-plan')
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    planController.createPlan,
  );

router
  .route('/delete-plan/:id')
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    planController.deletePlan,
  );

router.route('/').get(authController.protect, planController.getAllPlans);

router
  .route('/edit-plan/:id')
  .patch(authController.protect, planController.editPlan);

router.route('/:id').get(authController.protect, planController.getPlan);

module.exports = router;
