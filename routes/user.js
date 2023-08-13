const express = require('express');

const router = express.Router();
const userCtrl = require('../controllers/user');
const checkAutho = require('../middleware/checkAutho');

module.exports = {
  create: router.post('/users', userCtrl.create),
  login: router.post('/users/login', userCtrl.login),
  logout: router.get('/users/logout', userCtrl.logout),
  setAdmin: router.patch('/users', checkAutho(true, false), userCtrl.setAdmin),
  updateUser: router.put('/users/:id', checkAutho(true, false), userCtrl.updateUser),
  getUsers: router.get('/users', checkAutho(true, false), userCtrl.getUsers),
};
