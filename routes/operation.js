const express = require('express');

const router = express.Router();

const operationCtrl = require('../controllers/operation');

module.exports = {
  createOperation: router.post('/operations', operationCtrl.createOperation),
  getTransactionOperations: router.get('/operations/transactions/:id', operationCtrl.getTransactionOperations),
};
