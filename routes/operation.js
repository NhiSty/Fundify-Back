const express = require('express');

const router = express.Router();

const operationCtrl = require('../controllers/operation');

module.exports = {
  createCaptureOperation: router.post('/operation/capture/create', operationCtrl.createOperationCapture),
  createRefundOperation: router.post('/operation/refund/create', operationCtrl.createOperationRefund),
  getOperation: router.get('/operation/:id', operationCtrl.getOperation),
  getTransactionOperations: router.get('/operations/transaction/:id', operationCtrl.getTransactionOperations),
  updateOperation: router.put('/operation/update', operationCtrl.updateOperation),
  deleteOperation: router.delete('/operation/:id', operationCtrl.deleteOperation),
};
