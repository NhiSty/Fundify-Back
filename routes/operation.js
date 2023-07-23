const express = require('express');
const operationMiddleware = require('../middleware/operation');

const router = express.Router();
router.use(operationMiddleware);

const operationCtrl = require('../controllers/operation');

router.post('/operation/create', operationCtrl.createOperation);

router.get('/operation/:id', operationCtrl.getOperation);

router.get('/operations/transaction/:id', operationCtrl.getTransactionOperations);

router.put('/operation/update', operationCtrl.updateOperation);

router.delete('/operation/:id', operationCtrl.deleteOperation);

module.exports = router;
