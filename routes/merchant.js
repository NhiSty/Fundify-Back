const express = require('express');
const bearerMiddleware = require('../middleware/bearerMiddleware');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

const merchantCtrl = require('../controllers/merchant');

module.exports = {
  getMerchantTransactions: router.get('/merchants/:id/transactions', bearerMiddleware, merchantCtrl.getMerchantTransactions),
  getMerchantTransactionById: router.get('/merchants/:id/transaction/:transactionId', authMiddleware, merchantCtrl.getMerchantTransactionById),
  getMerchant: router.get('/merchants/:id', authMiddleware, merchantCtrl.getMerchantAccount),
  getAllMerchants: router.get('/merchants', authMiddleware, merchantCtrl.getMerchants),
  validateOrInvalidateMerchant: router.patch('/merchants/:id', authMiddleware, merchantCtrl.validateOrInvalidateMerchant),
  updateMerchantAccount: router.put('/merchants/:id', authMiddleware, merchantCtrl.updateMerchantAccount),
};
