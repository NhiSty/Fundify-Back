const express = require('express');

const router = express.Router();

const operationCtrl = require('../controllers/operation');

module.exports = {
  createOperation: router.post('/operation', operationCtrl.createOperation),
  getOperation: router.get('/operation/:id', operationCtrl.getOperation),
  getTransactionOperations: router.get('/operations/transaction/:id', operationCtrl.getTransactionOperations),
  updateOperation: router.put('/operation/update', operationCtrl.updateOperation),
  deleteOperation: router.delete('/operation/:id', operationCtrl.deleteOperation),
  operationWebhook: router.post('/operation/webhook', operationCtrl.operationWebhook),
};
