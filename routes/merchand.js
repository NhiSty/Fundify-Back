const express = require('express');

const router = express.Router();

const merchandCtrl = require('../controllers/merchand');

router.post('/signup', merchandCtrl.signup);
router.post('/login', merchandCtrl.login);

router.get('/', (req, res) => res.send('Hello World!'));
module.exports = router;
