const express = require('express');

const bearerMiddleware = require('../middleware/bearerMiddleware');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

const operationCtrl = require('../controllers/operation');

module.exports = {
  createOperation: router.post('/operations', bearerMiddleware, operationCtrl.createOperation),
  getTransactionOperations: router.get('/operations/transactions/:id', authMiddleware, operationCtrl.getTransactionOperations),
};
