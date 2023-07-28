const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

const operationCtrl = require('../controllers/operation');

module.exports = {
  createOperation: router.post('/operations', authMiddleware, operationCtrl.createOperation),
  getTransactionOperations: router.get('/operations/transactions/:id', authMiddleware, operationCtrl.getTransactionOperations),
};
