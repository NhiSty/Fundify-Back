/* eslint-disable no-console */
const express = require('express');
const cors = require('cors');
require('./mongoDb/index');

const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const errorHandler = require('./middleware/errorHandler');
const merchantAuthMiddleware = require('./middleware/merchantAuthMiddleware');
const authMiddleware = require('./middleware/authMiddleware');
const bearerMiddleware = require('./middleware/bearerMiddleware');
const merchantRoutes = require('./routes/merchant');
const transactionRoutes = require('./routes/transaction');
const operationRoutes = require('./routes/operation');
const sdkRoutes = require('./routes/sdk');
const webhooks = require('./routes/webhook');

app.set('view engine', 'ejs');
const userRoutes = require('./routes/user');

app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '5mb' }));
app.use(cors(
  {
    origin: [
      'http://localhost:8080',
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'http://localhost:3000',
    ],
    credentials: true,
  },
));
// eslint-disable-next-line consistent-return
app.use((req, res, next) => {
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    if (!req.is('application/json')) {
      return res.status(400)
        .json();
    }
  }
  next();
});

app.use('/api/auth', userRoutes.create);
app.use('/api/', sdkRoutes);
app.use('/api', webhooks);
app.use('/api/auth', userRoutes.login);
app.use('/api/auth', userRoutes.logout);

app.use(authMiddleware);
app.use('/api', operationRoutes.createOperation);
app.use('/api', operationRoutes.getOperation);
app.use('/api', operationRoutes.updateOperation);
app.use('/api', operationRoutes.deleteOperation);
app.use('/api', operationRoutes.getTransactionOperations);

// app.use(merchantAuthMiddleware);
// app.use(bearerMiddleware);
app.use('/api', transactionRoutes.getMerchantTransactions);
app.use('/api', transactionRoutes.getTransaction);
app.use('/api', transactionRoutes.deleteTransaction);
app.use('/api', transactionRoutes.updateTransaction);

app.use('/api', merchantRoutes.getMerchantAccount);
app.use('/api', merchantRoutes.getMerchantTransactions);

app.use('/api', userRoutes.setAdmin);
app.use('/api', userRoutes.validateOrInvalidateMerchant);

app.use(errorHandler);

/*
try {
  db.connection.authenticate().then(() => {
    console.log('Connection has been established successfully.');
  });
} catch (error) {
  console.error('Unable to connect to the database:', error);
}

 */

app.use('/', express.static(path.join(__dirname, './public')));
module.exports = app;
