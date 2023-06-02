/* eslint-disable no-console */
const express = require('express');

const app = express();
const bodyParser = require('body-parser');
require('dotenv').config();
const mongoose = require('mongoose');
const path = require('path');

app.use(bodyParser.json());

const userRoutes = require('./routes/user');

app.use('/api/auth', userRoutes);

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

mongoose.connect(
  `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_DB}/?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
)
  .then(() => console.log('[\x1b[32mOK\x1b[0m] MongoDB connection'))
  .catch((error) => console.log(`[\x1b[31mERROR\x1b[0m] ${error}`));

app.use('/', express.static(path.join(__dirname, './public')));

module.exports = app;
