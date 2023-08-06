const express = require('express');

const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

const userCtrl = require('../controllers/user');

module.exports = {
  create: router.post('/users', userCtrl.create),
  login: router.post('/users/login', userCtrl.login),
  logout: router.get('/users/logout', userCtrl.logout),
  setAdmin: router.patch('/users', authMiddleware, userCtrl.setAdmin),
  updateUser: router.put('/users/:id', authMiddleware, userCtrl.updateUser),
  getUsers: router.get('/users', authMiddleware, userCtrl.getUsers),
};
