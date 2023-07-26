const express = require('express');
const operationCtrl = require('../controllers/operation');

const router = express.Router();

router.post('/operation/webhook', async (req, res) => {
  const data = req.body;

  try {
    await operationCtrl.operationWebhook(data);
    res.sendStatus(200);
  } catch (error) {
    console.log('in error');
    res.sendStatus(404);
  }
});

module.exports = router;
