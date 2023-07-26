const db = require('../db/index');
const OperationValidator = require('../validator/OperationValidator');
const TransactionMDb = require('../mongoDb/models/Transaction');

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
    await fetch('http://psp:1338/api/psp/transactions/verifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: restBody.amount,
        currency: transaction.currency,
        operationId: operation.id,
        transactionId: transaction.id,
      }),
    });

    await operation.update({ status: 'processing' }, { where: { id: operation.id } });
    return res.status(201).json(operation);
  } catch (error) {
    await operation.update({ status: 'failed' }, { where: { id: operation.id } });
    return res.sendStatus(500);
  }
};

exports.getOperation = async (req, res) => {
  const operationId = req.params.id;

  if (!operationId) {
    return res.status(422).json();
  }
  const operation = await db.Operation.findOne({ where: { id: operationId } });

  if (!operation) {
    return res.status(404).json();
  }

  return res.status(200).json(operation);
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

exports.updateOperation = async (req, res) => {
  const operationId = req.body.id;

  if (req.body.type && !OperationValidator.validateType(req.body.type)) {
    return res.status(422).json();
  }
  if (req.body.amount && !OperationValidator.validateAmount(req.body.amount)) {
    return res.status(422).json();
  }
  if (req.body.status && !OperationValidator.validateStatus(req.body.status)) {
    return res.status(422).json();
  }

  if (!operationId) {
    return res.status(422).json();
  }

  const operationToUpdate = await db.Operation.findOne({ where: { id: operationId } });
  if (!operationToUpdate) {
    return res.status(404).json();
  }
  const updatedOperation = await operationToUpdate.update(req.body, { where: { id: operationId } });

  if (!updatedOperation) {
    return res.status(404).json();
  }
  return res.status(200).json(updatedOperation);
};

exports.deleteOperation = async (req, res) => {
  const operationId = req.params.id;
  if (!operationId) {
    return res.status(422).json();
  }

  const operationToArchive = await db.Operation.findOne({ where: { id: operationId } });
  if (!operationToArchive) {
    return res.status(404).json();
  }

  const archivedOperation = await db.Operation.update(
    {
      status: 'cancelled',
      deletedAt: Date.now(),
    },
    { where: { id: operationId } },
  );

  if (!archivedOperation) {
    return res.status(404).json();
  }
  return res.status(204).send();
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
    throw new Error('Error updating operation');
  }
};
