const db = require('../db/index');
const OperationValidator = require('../validator/OperationValidator');
const TransactionMDb = require('../mongoDb/models/Transaction');
require('dotenv').config();

exports.createOperation = async (req, res) => {
  const { transactionId } = req.body;

  if (!transactionId) {
    return res.sendStatus(422);
  }
  if (!await OperationValidator.validateAmount(req.body.amount, transactionId)) {
    return res.sendStatus(422);
  }
  if (req.body.status && !OperationValidator.validateStatus(req.body.status)) {
    return res.sendStatus(422);
  }

  const transaction = await db.Transaction.findByPk(transactionId);

  if (!transaction) {
    return res.sendStatus(422);
  }

  const { type, ...restBody } = req.body;

  let operation;

  if (transaction.status === 'created') {
    operation = await db.Operation.create({
      type: 'capture',
      transactionId,
      amount: restBody.amount,
    });
  } else {
    operation = await db.Operation.create({
      type: 'refund',
      transactionId,
      amount: restBody.amount,
    });
  }

  try {
    await fetch(process.env.URL_PSP_VERIFICATION, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: restBody.amount,
        currency: transaction.currency,
        operationId: operation.id,
        transactionId: transaction.id,
        notificationUrl: process.env.URL_NOTIF_PSP,
      }),
    });

    await operation.update({ status: 'processing' }, { where: { id: operation.id } });
    return res.status(201).json(operation);
  } catch (error) {
    await operation.update({ status: 'failed' }, { where: { id: operation.id } });
    return res.sendStatus(500);
  }
};

exports.getTransactionOperations = async (req, res) => {
  const transactionId = req.params.id;

  if (!transactionId) {
    return res.status(422).json();
  }
  const transaction = await db.Transaction.findByPk(transactionId);

  if (!transaction) {
    return res.status(404).json();
  }

  const operations = await db.Operation.findAll({ where: { transactionId } });
  return res.status(200).json(operations);
};

exports.operationWebhook = async (notificationData) => {
  try {
    const operation = await db.Operation.findOne({ where: { id: notificationData.operationId } });

    if (!operation) {
      throw new Error('Operation not found');
    }

    await operation.update(
      { status: 'done' },
      { where: { id: notificationData.operationId } },
    );
    const transactionMDb = await TransactionMDb.findOne({ transactionId: notificationData.transactionId });

    if (!transactionMDb) {
      throw new Error('Transaction not found');
    }

    const refundAvailable = transactionMDb.refundAmountAvailable;
    let status = 'captured';

    if (operation.type === 'refund' && refundAvailable > 0) {
      status = 'partial_refunded';
    }

    if (operation.type === 'refund' && refundAvailable === 0) {
      status = 'refunded';
    }

    const transaction = await db.Transaction.findOne({ where: { id: notificationData.transactionId } });
    await db.Transaction.update({ status }, { where: { id: transaction.id } });
    await db.TransactionStatusHist.create({ status, transactionId: transaction.id });
  } catch (error) {
    console.log(error);
  }
};
