const db = require('../db/index');
const TransactionMDb = require('../mongoDb/models/Transaction');

const TransactionValidator = require('../validator/TransactionValidator');
const {
  authorize,
  checkRole,
} = require('../utils/authorization');
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
    authorize(req, res, merchantId, false);

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

    console.log(process.env.URL_PAYMENT_FORM);

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
    checkRole(req, res, 'admin');

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
    const { merchantId } = transaction;
    authorize(req, res, merchantId);
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
    authorize(req, res, merchantId);

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
