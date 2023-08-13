const express = require('express');

const checkAutho = require('../middleware/checkAutho');

const router = express.Router();

const operationCtrl = require('../controllers/operation');

module.exports = {
  createOperation: router.post('/operations', checkAutho(true, true), operationCtrl.createOperation),
  getTransactionOperations: router.get('/operations/transactions/:id', checkAutho(true, true), operationCtrl.getTransactionOperations),
};
