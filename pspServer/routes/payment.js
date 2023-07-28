const express = require('express');

const router = express.Router();
const paymentCtrl = require('../controllers/payment');

module.exports = {
  verifications: router.post('/transactions/verifications', paymentCtrl.verifications),
};
