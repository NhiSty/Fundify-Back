const express = require('express');

const router = express.Router();

const transactionCtrl = require('../controllers/transaction');

module.exports = {
  getTransaction: router.get('/transaction/:id', transactionCtrl.getTransaction),
  getMerchantTransactions: router.get('/transactions/merchant/:id', transactionCtrl.getMerchantTransactions),
  updateTransaction: router.put('/transaction/update', transactionCtrl.updateTransaction),
  deleteTransaction: router.delete('/transaction/:id', transactionCtrl.deleteTransaction),
  createTransaction: router.post('/transaction/create', transactionCtrl.createTransaction),
};
