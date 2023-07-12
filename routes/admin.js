const express = require('express');

const router = express.Router();

const adminCtrl = require('../controllers/admin');

router.put('/validate', adminCtrl.validate);
router.put('/invalidate', adminCtrl.invalidate);

module.exports = router;
