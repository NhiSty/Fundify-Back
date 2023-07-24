const express = require('express');

const router = express.Router();

const adminCtrl = require('../controllers/admin');

router.put('/admin/merchant/validate', adminCtrl.validateMarchant);

router.put('/admin/merchant/invalidate', adminCtrl.invalidateMarchant);

router.put('/admin/merchant/reject', adminCtrl.rejectMarchant);

router.get('/admin/merchants', adminCtrl.getMerchants);
router.get('/admin/transactions', adminCtrl.getTransactions);
router.get('/admin/operations', adminCtrl.getOperations);

router.put('/admin/merchant/update', adminCtrl.updateMerchantAccount);

module.exports = router;
