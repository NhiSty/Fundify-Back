const express = require('express');

const router = express.Router();

const adminCtrl = require('../controllers/User');

module.exports = {
  validateMerchant: router.put('/admin/merchant/validate', adminCtrl.validateMarchant),
  getMerchants: router.get('/admin/merchants', adminCtrl.getMerchants),
  getTransactions: router.get('/admin/transactions', adminCtrl.getTransactions),
  getOperations: router.get('/admin/operations', adminCtrl.getOperations),
  updateMerchantAccount: router.put('/admin/merchant/update', adminCtrl.updateMerchantAccount),
  create: router.post('/create', adminCtrl.create),
  login: router.post('/login', adminCtrl.login),
  logout: router.get('/logout', adminCtrl.logout),
  setAdmin: router.put('/admin/user/setAdmin', adminCtrl.setAdmin),
};
