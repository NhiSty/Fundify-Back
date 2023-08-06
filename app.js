/* eslint-disable no-console */
const express = require('express');
const cors = require('cors');
require('./mongoDb/index');

const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const errorHandler = require('./middleware/errorHandler');
const merchantRoutes = require('./routes/merchant');
const transactionRoutes = require('./routes/transaction');
const kpisRoute = require('./routes/kpis');
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
      'https://backend.fundify.shop',
      'https://fundify.shop',
      'http://127.0.0.1:5174',
      'https://fundify-backoffice-ztt4.vercel.app',
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

// Pas de protection sur ces routes
app.use('/api/auth', userRoutes.login);
app.use('/api/auth', userRoutes.create);
app.use('/api/', sdkRoutes);
app.use('/api', webhooks);

// Routes protégées par le middleware d'authentification (seulement)
app.use('/api', operationRoutes.getTransactionOperations);
app.use('/api', merchantRoutes.getMerchantTransactionById);
app.use('/api', merchantRoutes.getMerchant);
app.use('/api', merchantRoutes.updateMerchantAccount);
app.use('/api', transactionRoutes.getTransaction);
app.use('/api', userRoutes.updateUser);
app.use('/api/auth', userRoutes.logout);
app.use('/api', kpisRoute.getTransactionsStatusKPIS);

// Routes protégées par le middleware d'authentification (seulement) et admin
app.use('/api', merchantRoutes.getAllMerchants);
app.use('/api', merchantRoutes.validateOrInvalidateMerchant);
app.use('/api', transactionRoutes.getAllTransactions);
app.use('/api', userRoutes.setAdmin);
app.use('/api', userRoutes.getUsers);

// Routes protégées par middleware de vérification du Bearer Token (seulement)
app.use('/api', transactionRoutes.createTransaction);
app.use('/api', merchantRoutes.getMerchantTransactions);
app.use('/api', operationRoutes.createOperation);

app.use(errorHandler);

app.use('/', express.static(path.join(__dirname, './public')));
module.exports = app;
