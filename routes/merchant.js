const express = require('express');

const router = express.Router();

const merchantCtrl = require('../controllers/merchant');

module.exports = {
  getMerchantTransactions: router.get('/merchants/:id/transactions', merchantCtrl.getMerchantTransactions),
  getMerchantTransactionById: router.get('/merchants/:id/transaction/:transactionId', merchantCtrl.getMerchantTransactionById),
  getMerchant: router.get('/merchants/:id', merchantCtrl.getMerchantAccount),
  getAllMerchants: router.get('/merchants', merchantCtrl.getMerchants),
  validateOrInvalidateMerchant: router.patch('/merchants/:id', merchantCtrl.validateOrInvalidateMerchant),
  updateMerchantAccount: router.put('/merchants/:id', merchantCtrl.updateMerchantAccount),
};
