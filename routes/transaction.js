const express = require('express');

const router = express.Router();
const transactionCtrl = require('../controllers/transaction');
const checkAutho = require('../middleware/checkAutho');

module.exports = {
  getTransaction: router.get('/transaction/:id', checkAutho(true, true), transactionCtrl.getTransaction),
  getAllTransactions: router.get('/transactions', checkAutho(true, true), transactionCtrl.getAllTransactions),
  createTransaction: router.post('/transactions', checkAutho(true, true), transactionCtrl.createTransaction),
  putTransaction: router.put('/transactions/:id', checkAutho(true, true), transactionCtrl.putTransaction),
};
