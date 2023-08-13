const express = require('express');

const router = express.Router();

const kpisCtrl = require('../controllers/kpis');
const checkAutho = require('../middleware/checkAutho');

module.exports = {
  getTransactionsStatusKPIS: router.get('/kpis/transactions-status', checkAutho(true, false), kpisCtrl.getTransactionsStatusKPIS),
  getMerchanAcceptedAndInWaiting: router.get('/kpis/merchants-status', checkAutho(true, false), kpisCtrl.getMerchanAcceptedAndInWaiting),
  getMerchantRegisteredByDate: router.get('/kpis/merchants-registered', checkAutho(true, false), kpisCtrl.getMerchantRegisteredByDate),
};
