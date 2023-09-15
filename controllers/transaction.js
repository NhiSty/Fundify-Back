const db = require('../db/index');
const TransactionMDb = require('../mongoDb/models/Transaction');

const TransactionValidator = require('../validator/TransactionValidator');
require('dotenv')
  .config();

// eslint-disable-next-line consistent-return
exports.createTransaction = async (req, res, next) => {
  const {
    merchantId,
    userId,
  } = req.body;
  const amout = parseFloat(req.body.amount);

  if (!merchantId) {
    throw new Error('422 Unprocessable Entity');
  }

  try {
    if (!userId) {
      throw new Error('422 Unprocessable Entity');
    }

    if (!TransactionValidator.validateAmount(amout)) {
      throw new Error('422 Unprocessable Entity');
    }

    if (!TransactionValidator.validateCurrency(req.body.currency)) {
      throw new Error('422 Unprocessable Entity');
    }
    const merchant = await db.Merchant.findByPk(merchantId);

    if (!merchant) {
      throw new Error('404 Not Found');
    }

    const transaction = await db.Transaction.create({
      amount: amout,
      currency: req.body.currency,
      merchantId: merchant.id,
      userId,
    });

    const merchantToSend = await db.Merchant.findByPk(merchantId);

    const credentials = await db.Credential.findByPk(merchantToSend.credentialsId);

    return res.status(201)
      .json({
        url: `${process.env.URL_PAYMENT_FORM}/${transaction.id}`,
        clientSecret: credentials.clientSecret,
      });
  } catch (error) {
    next(error);
  }
};

// eslint-disable-next-line consistent-return
exports.getAllTransactions = async (req, res, next) => {
  try {
    if (req.role !== 'admin') {
      return res.sendStatus(401);
    }

    const transactions = await TransactionMDb.find({});
    return res.status(200)
      .json(transactions);
  } catch (error) {
    next(error);
  }
};

// eslint-disable-next-line consistent-return
exports.getTransaction = async (req, res, next) => {
  const transactionId = req.params.id;
  if (!transactionId) {
    return res.status(422)
      .json();
  }

  try {
    const transaction = await TransactionMDb.find({ transactionId });
    if (!transaction) {
      return res.status(404)
        .json();
    }

    return res.status(200)
      .json(transaction);
  } catch (error) {
    next(error);
  }
};

// eslint-disable-next-line consistent-return
exports.getMerchantTransactions = async (req, res, next) => {
  const merchantId = req.params.id;

  if (!merchantId) {
    return res.status(422)
      .json();
  }

  try {
    const merchant = await db.Merchant.findByPk(merchantId);

    if (!merchant) {
      return res.status(404)
        .json();
    }

    const transactions = await TransactionMDb.find({ where: { merchantId } });
    return res.status(200)
      .json(transactions);
  } catch (error) {
    next(error);
  }
};

// eslint-disable-next-line consistent-return
exports.putTransaction = async (req, res, next) => {
  const transactionId = req.params.id;
  const {
    status,
    amount,
    currency,
  } = req.body;

  if (!transactionId) {
    return res.sendStatus(422);
  }

  try {
    if (amount && !TransactionValidator.validateAmount(amount)) {
      throw new Error('422 Unprocessable Entity');
    }

    if (currency && !TransactionValidator.validateCurrency(currency)) {
      throw new Error('422 Unprocessable Entity');
    }

    if (status && !TransactionValidator.validateStatus(status)) {
      throw new Error('422 Unprocessable Entity');
    }

    const transaction = await db.Transaction.findByPk(transactionId);

    if (!transaction) {
      return res.sendStatus(400);
    }

    await transaction.update({
      status,
    });

    await TransactionMDb.findOneAndUpdate({ transactionId }, {
      $set: {
        status,
      },
    });

    return res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};
