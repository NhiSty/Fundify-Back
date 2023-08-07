const express = require('express');
const bearerMiddleware = require('../middleware/bearerMiddleware');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

const transactionCtrl = require('../controllers/transaction');

module.exports = {
  getTransaction: router.get('/transaction/:id', authMiddleware, transactionCtrl.getTransaction),
  getAllTransactions: router.get('/transactions', authMiddleware, transactionCtrl.getAllTransactions),
  createTransaction: router.post('/transactions', authMiddleware, bearerMiddleware, transactionCtrl.createTransaction),
};
