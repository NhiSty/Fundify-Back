const express = require('express');

const router = express.Router();

const userCtrl = require('../controllers/User');

module.exports = {
  validateOrInvalidateMerchant: router.patch('/merchants/:id', userCtrl.validateOrInvalidateMerchant),
  getMerchants: router.get('/merchants', userCtrl.getMerchants),
  getOneMerchant: router.get('/merchants/:id', userCtrl.getOneMerchant),
  getTransactions: router.get('/transactions', userCtrl.getTransactions),
  updateMerchantAccount: router.put('/merchants/:id', userCtrl.updateMerchantAccount),
  create: router.post('/users', userCtrl.create),
  login: router.post('/users/login', userCtrl.login),
  logout: router.get('/users/logout', userCtrl.logout),
  setAdmin: router.patch('/users', userCtrl.setAdmin),
};
