/* eslint-disable no-console */
const express = require('express');
const cors = require('cors');

const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const errorHandler = require('./middleware/errorHandler');
const userRoutes = require('./routes/user');
const db = require('./db/index');
const orderRoutes = require('./routes/order');

app.use(bodyParser.json());
app.use(cors());
// eslint-disable-next-line consistent-return
app.use((req, res, next) => {
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    if (!req.is('application/json')) {
      return res.status(400).json();
    }
  }
  next();
});
app.use(errorHandler);
app.use('/api/auth', userRoutes);
app.use('/api/orders', orderRoutes);

try {
  db.connection.authenticate().then(() => {
    console.log('Connection has been established successfully.');
  });
} catch (error) {
  console.error('Unable to connect to the database:', error);
}

app.use('/', express.static(path.join(__dirname, './public')));
module.exports = app;
