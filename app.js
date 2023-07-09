/* eslint-disable no-console */
/**
 * @fileoverview
 * This file is the entry point of the application.
 * It creates the server and listens to the port defined in the environment variables.
 * It also handles the errors.
 * @module app
 */
const express = require('express');
const { Sequelize } = require('sequelize');
const cors = require('cors');

const app = express();
const bodyParser = require('body-parser');
require('dotenv').config();
const path = require('path');
const errorHandler = require('./middleware/errorHandler');

app.use(bodyParser.json());
app.use(cors());
app.use((req, res, next) => {
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    if (!req.is('application/json')) {
      return res.sendStatus(400);
    }
  }
  next();
});

app.use(errorHandler);

const userRoutes = require('./routes/user');

/**
 * Use the user routes.
 * @name api/auth
 * @type {Router}
 */
app.use('/api/auth', userRoutes);

const sequelize = new Sequelize(process.env.PG_DATABASE_URL);
try {
  sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
  });
} catch (error) {
  console.error('Unable to connect to the database:', error);
}

/**
 * Serve static files.
 * @name public
 * @type {string}
 */
app.use('/', express.static(path.join(__dirname, './public')));

/**
 * Export express app.
 * @type {Express}
 * @name app
 * @exports app
 * @see {@link https://expressjs.com/en/4x/api.html#app}
 */
module.exports = app;
