const express = require('express');

const router = express.Router();

const adminCtrl = require('../controllers/admin');

module.exports = {
  validateMerchant: router.put('/admin/merchant/validate', adminCtrl.validateMarchant),
  invalidateMarchant: router.put('/admin/merchant/invalidate', adminCtrl.invalidateMarchant),
  getMerchants: router.get('/admin/merchants', adminCtrl.getMerchants),
  getTransactions: router.get('/admin/transactions', adminCtrl.getTransactions),
  getOperations: router.get('/admin/operations', adminCtrl.getOperations),
  updateMerchantAccount: router.put('/admin/merchant/update', adminCtrl.updateMerchantAccount),
  signup: router.post('/signup', adminCtrl.signup),
  login: router.post('/login', adminCtrl.login),
  logout: router.get('/logout', adminCtrl.logout),
  setAdmin: router.put('/admin/user/setAdmin', adminCtrl.setAdmin),
};
