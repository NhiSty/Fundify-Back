const express = require('express');

const router = express.Router();

const sdkCtroller = require('../controllers/sdk');

router.get('/sdk/transactions/:id', sdkCtroller.sendForm);

module.exports = router;
