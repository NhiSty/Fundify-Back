const express = require('express');

const router = express.Router();

const userCtrl = require('../controllers/user');

module.exports = {
  signup: router.post('/signup', userCtrl.signup),
  login: router.post('/login', userCtrl.login),
  logout: router.get('/logout', userCtrl.logout),
  setAdmin: router.put('/admin/user/setAdmin', userCtrl.setAdmin),
};
