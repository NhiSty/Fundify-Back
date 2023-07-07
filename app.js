/* eslint-disable no-console */
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

app.use('/api/auth', userRoutes);

const sequelize = new Sequelize(process.env.PG_DATABASE_URL);
try {
  sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
  });
} catch (error) {
  console.error('Unable to connect to the database:', error);
}

app.use('/', express.static(path.join(__dirname, './public')));

module.exports = app;
