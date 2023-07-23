const db = require('../db/index');
const TransactionValidator = require('../validator/TransactionValidator');

exports.createTransaction = async (req, res) => {
  const { merchantId } = req.body;
  if (!merchantId) {
    return res.status(422).json();
  }

  if (req.body.status && !TransactionValidator.validateStatus(req.body.status)) {
    return res.status(422).json();
  }
  if (!TransactionValidator.validateAmount(req.body.amount)) {
    return res.status(422).json();
  }

  if (!TransactionValidator.validateCurrency(req.body.currency)) {
    return res.status(422).json();
  }
  const merchant = await db.Merchant.findByPk(merchantId);

  if (!merchant) {
    return res.status(404).json();
  }

  const transaction = await db.Transaction.create(req.body);
  return res.status(201).json(transaction);
};

exports.getTransaction = async (req, res) => {
  const transactionId = req.params.id;

  if (!transactionId) {
    return res.status(422).json();
  }

  const transaction = await db.Transaction.findOne({ where: { id: transactionId } });

  if (!transaction) {
    return res.status(404).json();
  }

  return res.status(200).json(transaction);
};

exports.getMerchantTransactions = async (req, res) => {
  const merchantId = req.params.id;

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
  if (req.body.status && !TransactionValidator.validateStatus(req.body.status)) {
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
  const deletedTransaction = await db.Transaction.destroy({ where: { id: transactionId } });

  if (!deletedTransaction) {
    return res.status(404).json();
  }
  return res.status(204).send();
};
