const express = require('express');

const router = express.Router();

const merchantCtrl = require('../controllers/merchant');

module.exports = {
  signup: router.post('/signup', merchantCtrl.signup),
  login: router.post('/login', merchantCtrl.login),
  getMerchantTransactions: router.get('/merchant/:id/transactions', merchantCtrl.getMerchantTransactions),
  getMerchantAccount: router.get('/merchant/:id/account', merchantCtrl.getMerchantAccount),
  updateMerchantAccount: router.put('/merchant/:id/account/update', merchantCtrl.update),
};
