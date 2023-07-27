const db = require('../db/index');
const TransactionMDb = require('../mongoDb/models/Transaction');

const statusEnum = [
  'PENDING',
  'CONFIRMED',
  'CANCELLED',
];
const TransactionValidator = require('../validator/TransactionValidator');
const idItsMe = require('../utils/idItsMe');
const { authorize } = require('../utils/authorization');

// eslint-disable-next-line consistent-return
exports.createTransaction = async (req, res, next) => {
  const { merchantId } = req.body;

  try {
    authorize(req, res, merchantId);

    if (!merchantId) {
      throw new Error('422 Unprocessable Entity');
    }

    if (req.body.status && statusEnum.includes(req.body.status) === false) {
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

    const transaction = await db.Transaction.create(req.body);

    return res.status(201).json(transaction);
  } catch (error) {
    next(error);
  }
};

exports.getAllTransactions = async (req, res) => {
  const transactions = await TransactionMDb.findAll();
  return res.status(200).json(transactions);
};

exports.getTransaction = async (req, res) => {
  const transactionId = req.params.id;

  if (!transactionId) {
    return res.status(422).json();
  }

  const transaction = TransactionMDb.findOne({ where: { id: transactionId } });

  const { merchantId, userId } = transaction;
  if (idItsMe(req, merchantId)) {
    return res.status(403).json();
  }

  if (idItsMe(req, userId)) {
    return res.status(403).json();
  }

  if (!transaction) {
    return res.status(404).json();
  }

  return res.status(200).json(transaction);
};

exports.getMerchantTransactions = async (req, res) => {
  const merchantId = req.params.id;

  if (idItsMe(req, merchantId)) {
    return res.status(403).json();
  }

  if (!merchantId) {
    return res.status(422).json();
  }

  const merchant = await db.Merchant.findByPk(merchantId);

  if (!merchant) {
    return res.status(404).json();
  }

  const transactions = await db.Transaction.findAll({ where: { merchantId } });
  return res.status(200).json(transactions);
};

exports.updateTransaction = async (req, res) => {
  const transactionId = req.body.id;
  if (!transactionId) {
    return res.status(422).json();
  }
  if (req.body.status && statusEnum.includes(req.body.status) === false) {
    return res.status(422).json();
  }
  if (req.body.amount && !TransactionValidator.validateAmount(req.body.amount)) {
    return res.status(422).json();
  }
  if (req.body.currency && !TransactionValidator.validateCurrency(req.body.currency)) {
    return res.status(422).json();
  }

  const transactionToUpdate = await db.Transaction.findOne({ where: { id: transactionId } });
  if (!transactionToUpdate) {
    return res.status(404).json();
  }

  const updatedTransaction = await transactionToUpdate.update(req.body, { where: { id: transactionId } });

  if (!updatedTransaction) {
    return res.status(404).json();
  }
  return res.status(200).json(updatedTransaction);
};

exports.deleteTransaction = async (req, res) => {
  const transactionId = req.params.id;
  if (!transactionId) {
    return res.status(422).json();
  }

  const transactionToArchive = await db.Transaction.findOne({ where: { id: transactionId } });
  if (!transactionToArchive) {
    return res.status(404).json();
  }

  // si un lambda essai d'archiver une transaction qui ne lui appartient pas
  const { merchantId } = transactionToArchive;

  if (idItsMe(req, merchantId)) {
    return res.status(403).json();
  }

  const archivedTransaction = await db.Transaction.update(
    { status: 'cancelled', deletedAt: Date.now() },
    { where: { id: transactionId } },
  );

  if (!archivedTransaction) {
    return res.status(404).json();
  }
  return res.status(204).send();
};

exports.confirmTransaction = async (req, res) => {
  const transactionId = req.params.id;
  if (!transactionId) {
    return res.status(422).json();
  }

  const transaction = await db.Transaction.findOne({ where: { id: transactionId } });
  if (!transaction) {
    return res.status(404).json();
  }

  if (transaction.status !== 'PENDING') {
    return res.status(409).json();
  }

  const updatedTransaction = await transaction.update({ status: 'CONFIRMED' }, { where: { id: transactionId } });

  if (!updatedTransaction) {
    return res.status(404).json();
  }
  return res.status(200).json(updatedTransaction);
  // console.log('Youhou, j\'ai réussi à faire le PSP !');
};
