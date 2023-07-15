const express = require('express');

const router = express.Router();

const merchantCtrl = require('../controllers/merchant');

router.post('/signup', merchantCtrl.signup);
router.post('/login', merchantCtrl.login);

router.get('/', (req, res) => res.send('Hello World!'));
module.exports = router;
