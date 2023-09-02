const db = require('../db/index');
const OperationValidator = require('../validator/OperationValidator');
const TransactionMDb = require('../mongoDb/models/Transaction');
const requestPspCheck = require('../utils/requestPspCheck');
require('dotenv').config();

exports.createOperation = async (req, res) => {
  const { transactionId, merchantId } = req.body;

  console.log('req.body', req);
  if (!merchantId) {
    return res.sendStatus(422);
  }

  const merchant = await db.Merchant.findByPk(merchantId);

  if (!merchant) {
    return res.sendStatus(422);
  }

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
  const transactionMongo = await TransactionMDb.findOne({ transactionId });

  if (!transaction || !transactionMongo) {
    return res.sendStatus(422);
  }

  const { type, ...restBody } = req.body;

  let operation;

  if (transaction.status === 'refunded' || transaction.status === 'cancelled') {
    // On stop car plus aucune opération possible sur cette transaction
    return res.sendStatus(400);
  }

  // Si la transaction a le status created, on crée d'abord une operation de type authorization
  if (transaction.status === 'created') {
    // Création opération de type authorization
    operation = await db.Operation.create({
      type: 'authorization',
      transactionId,
      amount: restBody.amount,
    });
  }

  if (transaction.status === 'partial_captured' || transaction.status === 'authorized') {
    operation = await db.Operation.create({
      type: 'capture',
      transactionId,
      amount: restBody.amount,
    });
  }

  if (transaction.status === 'captured' || transaction.status === 'partial_refunded') {
    operation = await db.Operation.create({
      type: 'refund',
      transactionId,
      amount: restBody.amount,
    });
  }
  try {
    // Demande de verif au PSP
    await requestPspCheck({
      amount: restBody.amount,
      currency: transaction.currency,
      operationId: operation.id,
      transactionId: transaction.id,
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

/**
 * Ici on gère les conséquences après la réception d'une notification du PSP
 * On traite donc les opérations et transactions en fonction de la notification reçue
 * @param notificationData
 * @returns {Promise<void>}
 */
exports.operationWebhook = async (notificationData) => {
  try {
    // On récupère l'opération correspondante à la notification
    const operation = await db.Operation.findOne({ where: { id: notificationData.operationId } });

    if (!operation) {
      throw new Error('Operation not found');
    }

    // Si on est ici c'est que le PSP a répondu à la demande de vérification, donc opération done
    await operation.update(
      { status: 'done' },
      { where: { id: notificationData.operationId } },
    );

    // On récupère la transaction liée à l'opération
    const transaction = await db.Transaction.findOne({ where: { id: notificationData.transactionId } });

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    const merchant = await db.Merchant.findOne({ where: { id: transaction.merchantId } });

    if (!merchant) {
      throw new Error('Merchant not found');
    }

    // Si l'opération est de type authorization, on crée une operation de type capture
    if (operation.type === 'authorization') {
      if (merchant.autoCapture) {
        // Création opération de type capture
        const captureOperation = await db.Operation.create({
          type: 'capture',
          transactionId: notificationData.transactionId,
          amount: notificationData.amount,
        });

        // Demande de verif au PSP
        requestPspCheck({
          amount: notificationData.amount,
          currency: notificationData.currency,
          operationId: captureOperation.id,
          transactionId: notificationData.transactionId,
        })
          // Première réponse du PSP donc opération en cours
          .then(() => {
            captureOperation.update({ status: 'processing' }, { where: { id: captureOperation.id } });
            console.log('capture operation created');
          })
          // Fail donc opération failed
          .catch(() => {
            captureOperation.update({ status: 'failed' }, { where: { id: captureOperation.id } });
            console.log('capture operation failed');
          });
      }
    }
  } catch (error) {
    console.log(error);
  }
};
