const express = require('express');

const router = express.Router();

const sdkCtroller = require('../controllers/sdk');

router.get('/sdk/transaction/:id', sdkCtroller.sendForm);
router.post('/sdk/process-payment', sdkCtroller.processPayment);

module.exports = router;
