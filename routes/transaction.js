const express = require('express');

const router = express.Router();

const transactionCtrl = require('../controllers/transaction');

module.exports = {
  getTransaction: router.get('/transaction/:id', transactionCtrl.getTransaction),
  getAllTransactions: router.get('/transactions', transactionCtrl.getAllTransactions),
  updateTransaction: router.put('/transactions', transactionCtrl.updateTransaction),
  createTransaction: router.post('/transactions', transactionCtrl.createTransaction),
};
