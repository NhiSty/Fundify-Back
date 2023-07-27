const db = require('../db/index');
const TransactionMDb = require('../mongoDb/models/Transaction');

const TransactionValidator = require('../validator/TransactionValidator');
const { authorize, checkRole} = require('../utils/authorization');

// eslint-disable-next-line consistent-return
exports.createTransaction = async (req, res, next) => {
  const { merchantId, userId } = req.body;

  if (!merchantId) {
    throw new Error('422 Unprocessable Entity');
  }

  try {
    authorize(req, res, merchantId);

    if (!userId) {
      throw new Error('422 Unprocessable Entity');
    }

    if (!TransactionValidator.validateAmount(req.body.amount)) {
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
      amount: req.body.amount,
      currency: req.body.currency,
      merchantId: merchant.id,
      userId: req.userId,
    });

    return res.status(201).json(transaction);
  } catch (error) {
    next(error);
  }
};

// eslint-disable-next-line consistent-return
exports.getAllTransactions = async (req, res, next) => {
  try {
    checkRole(req, res, 'admin');

    const transactions = await TransactionMDb.findAll();
    return res.status(200).json(transactions);
  } catch (error) {
    next(error);
  }
};

// eslint-disable-next-line consistent-return
exports.getTransaction = async (req, res, next) => {
  const transactionId = req.params.id;
  if (!transactionId) {
    return res.status(422).json();
  }
  try {
    const transaction = TransactionMDb.findOne({ where: { id: transactionId } });
    if (!transaction) {
      return res.status(404).json();
    }
    const { merchantId } = transaction;
    authorize(req, res, merchantId);
    return res.status(200).json(transaction);
  } catch (error) {
    next(error);
  }
};

// eslint-disable-next-line consistent-return
exports.getMerchantTransactions = async (req, res, next) => {
  const merchantId = req.params.id;

  if (!merchantId) {
    return res.status(422).json();
  }

  try {
    authorize(req, res, merchantId);

    const merchant = await db.Merchant.findByPk(merchantId);

    if (!merchant) {
      return res.status(404).json();
    }

    const transactions = await TransactionMDb.findAll({ where: { merchantId } });
    return res.status(200).json(transactions);
  } catch (error) {
    next(error);
  }
};
