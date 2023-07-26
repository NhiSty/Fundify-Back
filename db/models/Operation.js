const { Model, DataTypes } = require('sequelize');
const OperationStatusHist = require('./OperationStatusHist');
const TransactionStatusHist = require('./TransactionStatusHist');
const TransactionMDb = require('../../mongoDb/models/Transaction');

module.exports = (connection) => {
  class Operation extends Model {}

  Operation.init({
    type: {
      type: DataTypes.ENUM('capture', 'refund'),
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    transactionId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Transactions',
        key: 'id',
      },
    },
    status: {
      type: DataTypes.ENUM('created', 'processing', 'done', 'failed'),
      defaultValue: 'created',
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    sequelize: connection,
    modelName: 'Operation',
    timestamps: true,
  });

  // Après création d'une opération (Postgres) on crée une opération (MongoDB)
  Operation.afterCreate(async (operation) => {
    await OperationStatusHist(connection).create({
      operationId: operation.id,
      status: operation.status,
    });

    if (operation.type === 'refund') {
      await TransactionStatusHist(connection).create({
        transactionId: operation.transactionId,
        status: 'waiting_refund',
      });
    }

    await TransactionMDb.updateOne({ transactionId: operation.transactionId }, {
      $addToSet: {
        operations: {
          operationId: operation.id,
          type: operation.type,
          amount: parseInt(operation.amount, 10),
          status: operation.status,
          statusHist: [
            {
              status: operation.status,
              date: Date.now(),
            },
          ],
        },
        ...(operation.type === 'refund' && {
          statusHist: [
            {
              status: 'waiting_refund',
              date: Date.now(),
            },
          ],
        }),
      },
      $set: {
        ...(operation.type === 'refund' && { status: 'waiting_refund' }),
      },
    });
  });

  // Après mise à jour d'une opération (Postgres) on met à jour l'opération correspondante (MongoDB)
  Operation.afterUpdate(async (operation) => {
    await OperationStatusHist(connection).create({
      operationId: operation.id,
      status: operation.status,
    });

    const refundAmountAvailable = await TransactionMDb.aggregate([
      { $match: { transactionId: operation.transactionId } },
      {
        $unwind: '$operations',
      },
      {
        $group: {
          _id: '$_id',
          totalAmount: { $sum: { $cond: [{ $eq: ['$operations.type', 'capture'] }, '$operations.amount', 0] } },
          // eslint-disable-next-line max-len
          refundAmount: { $sum: { $cond: [{ $eq: ['$operations.type', 'refund'] }, '$operations.amount', operation.amount] } },
        },
      },
      {
        $project: {
          _id: 0,
          remainingAmount: { $subtract: ['$totalAmount', '$refundAmount'] },
        },
      },
    ]).exec();

    let trxStatus = 'captured';
    const operationDone = operation.status;
    const operationIsCapture = operation.type === 'capture';
    const allIsRefunded = refundAmountAvailable[0].remainingAmount === 0;

    if (!operationIsCapture && operationDone && allIsRefunded) {
      trxStatus = 'refunded';
    }

    if (!operationIsCapture && operationDone && !allIsRefunded) {
      trxStatus = 'partial_refunded';
    }

    await TransactionMDb.updateOne({ transactionId: operation.transactionId, 'operations.operationId': operation.id }, {
      $set: {
        'operations.$.status': operation.status,
        refundAmountAvailable: refundAmountAvailable[0].remainingAmount,
        ...(operation.status === 'done' && { status: trxStatus }),
      },
      $addToSet: {
        'operations.$.statusHist': [
          {
            status: operation.status,
            date: Date.now(),
          },
        ],
        ...((operation.status === 'done') && {
          statusHist: [
            {
              status: trxStatus,
              date: Date.now(),
            },
          ],
        }),
      },
    });
  });

  return Operation;
};
