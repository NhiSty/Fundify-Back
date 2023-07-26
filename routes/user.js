const express = require('express');

const router = express.Router();

const adminCtrl = require('../controllers/User');

module.exports = {
  validateMerchant: router.put('/merchant', adminCtrl.validateMarchant),
  getMerchants: router.get('/merchants', adminCtrl.getMerchants),
  getTransactions: router.get('/transactions', adminCtrl.getTransactions),
  getOperations: router.get('/operations', adminCtrl.getOperations),
  updateMerchantAccount: router.put('/merchant/update', adminCtrl.updateMerchantAccount),
  create: router.post('/create', adminCtrl.create),
  login: router.post('/login', adminCtrl.login),
  logout: router.get('/logout', adminCtrl.logout),
  setAdmin: router.put('/user/setAdmin', adminCtrl.setAdmin),
};
