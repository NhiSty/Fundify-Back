const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const paymentRoutes = require('./routes/payment');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(cors());

app.use('/api/psp', paymentRoutes.verifications);

module.exports = app;
