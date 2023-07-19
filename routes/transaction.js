const express = require('express');
const transactionMiddleware = require('../middleware/transaction');

const router = express.Router();
router.use(transactionMiddleware);

const transactionCtrl = require('../controllers/transaction');

router.post('/transaction/create', transactionCtrl.createTransaction);

router.get('/transaction/:id', transactionCtrl.getTransaction);

router.get('/transactions/merchant/:id', transactionCtrl.getMerchantTransactions);

router.put('/transaction/update', transactionCtrl.updateTransaction);

router.delete('/transaction/:id', transactionCtrl.deleteTransaction);

module.exports = router;
