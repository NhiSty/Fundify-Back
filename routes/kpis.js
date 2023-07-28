const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

const kpisCtrl = require('../controllers/kpis');

module.exports = {
  getTransactionsStatusKPIS: router.get('/kpis/transactions-status', authMiddleware, kpisCtrl.getTransactionsStatusKPIS),
  getMerchanAcceptedAndInWaiting: router.get('/kpis/merchants-status', authMiddleware, kpisCtrl.getMerchanAcceptedAndInWaiting),
  getMerchantRegisteredByDate: router.get('/kpis/merchants-registered', authMiddleware, kpisCtrl.getMerchantRegisteredByDate),
};
