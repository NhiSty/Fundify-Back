const express = require('express');
const checkAutho = require('../middleware/checkAutho');

const router = express.Router();

const merchantCtrl = require('../controllers/merchant');

module.exports = {
  getMerchantTransactions: router.get('/merchants/:id/transactions', checkAutho(true, false), merchantCtrl.getMerchantTransactions),
  getMerchantTransactionById: router.get('/merchants/:id/transaction/:transactionId', checkAutho(true, false), merchantCtrl.getMerchantTransactionById),
  getMerchant: router.get('/merchants/:id', checkAutho(true, false), merchantCtrl.getMerchantAccount),
  getAllMerchants: router.get('/merchants', checkAutho(true, false), merchantCtrl.getMerchants),
  validateOrInvalidateMerchant: router.patch('/merchants/:id', checkAutho(true, false), merchantCtrl.validateOrInvalidateMerchant),
  updateMerchantAccount: router.put('/merchants/:id', checkAutho(true, false), merchantCtrl.updateMerchantAccount),
  regenerateCredentials: router.put('/merchants/:id/credentials', checkAutho(true, false), merchantCtrl.regenerateCredentials),
};
