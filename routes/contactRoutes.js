const express = require('express');
const contactController = require('../controllers/contactController');
const authController = require('../controllers/authController');

const router = express.Router();
router.use(authController.protect, authController.restrictTo('admin'))

router.route('/contacts').get(contactController.getNumbers);

router
  .route('/edit-contact/:id')
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    contactController.editNumber,
  );

router
  .route('/create-contact')
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    contactController.addContact,
  );

router
  .route('/delete-contact/:id')
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    contactController.deleteContact,
  );

module.exports = router;
