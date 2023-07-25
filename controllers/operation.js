const db = require('../db/index');
const OperationValidator = require('../validator/OperationValidator');

exports.createOperationCapture = async (req, res) => {
  const { transactionId } = req.body;

  if (!transactionId) {
    return res.status(422).json();
  }

  if (!OperationValidator.validateAmount(req.body.amount)) {
    return res.status(422).json();
  }
  if (req.body.status && !OperationValidator.validateStatus(req.body.status)) {
    return res.status(422).json();
  }

  const transaction = await db.Transaction.findByPk(transactionId);

  if (!transaction) {
    return res.status(404).json();
  }

  const { type, ...restBody } = req.body;

  const operation = await db.Operation.create({
    type: 'captured',
    ...restBody,
  });
  return res.status(201).json(operation);
};

exports.createOperationRefund = async (req, res) => {
  const { transactionId } = req.body;

  if (!transactionId) {
    return res.status(422).json();
  }

  if (!OperationValidator.validateAmount(req.body.amount)) {
    return res.status(422).json();
  }
  if (req.body.status && !OperationValidator.validateStatus(req.body.status)) {
    return res.status(422).json();
  }

  const transaction = await db.Transaction.findByPk(transactionId);

  if (!transaction) {
    return res.status(404).json();
  }

  const { type, ...restBody } = req.body;

  const operation = await db.Operation.create({
    type: 'refunded',
    ...restBody,
  });
  return res.status(201).json(operation);
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
