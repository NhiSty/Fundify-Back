const express = require('express');
const operationCtrl = require('../controllers/operation');
const { verifyApiKey } = require('../middleware/verifyPSPSecretKey');
require('dotenv').config();

const router = express.Router();

router.post('/operation/webhook', verifyApiKey, async (req, res) => {
  const data = req.body;

  try {
    await operationCtrl.operationWebhook(data);
    return res.sendStatus(200);
  } catch (error) {
    console.log('in error');
    return res.sendStatus(404);
  }
});

module.exports = router;
