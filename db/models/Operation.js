const { Model, DataTypes } = require('sequelize');
const OperationStatusHist = require('./OperationStatusHist');
const TransactionStatusHist = require('./TransactionStatusHist');
const TransactionMDb = require('../../mongoDb/models/Transaction');
const Transaction = require('./Transaction');

module.exports = (connection) => {
  class Operation extends Model {}

  Operation.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    type: {
      type: DataTypes.ENUM('capture', 'refund', 'authorization'),
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    transactionId: {
      type: DataTypes.UUID,
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
      },
    });

    if (operation.type === 'refund') {
      await TransactionMDb.updateOne({ transactionId: operation.transactionId }, {
        $set: {
          status: 'waiting_refund',
        },
        $addToSet: {
          statusHist: [
            {
              status: 'waiting_refund',
              date: Date.now(),
            },
          ],
        },
      });
    }
  });

  // Après mise à jour d'une opération (Postgres) on met à jour l'opération correspondante (MongoDB)
  Operation.afterUpdate(async (operation) => {
    await OperationStatusHist(connection).create({
      operationId: operation.id,
      status: operation.status,
    });

    const transaction = await TransactionMDb.findOne({ transactionId: operation.transactionId });

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
    const canUpdateOutstandingBalance = operation.type === 'capture' && transaction.outstandingBalance >= operation.amount && transaction.outstandingBalance > 0;

    // Mise à jour des status des opérations
    const res = await TransactionMDb.findOneAndUpdate({ transactionId: operation.transactionId, 'operations.operationId': operation.id }, {
      $set: {
        'operations.$.status': operation.status,
        refundAmountAvailable: refundAmountAvailable[0].remainingAmount,
      },
      $inc: {
        ...(canUpdateOutstandingBalance && { outstandingBalance: -parseInt(operation.amount, 10) }),
      },
      $addToSet: {
        'operations.$.statusHist': [
          {
            status: operation.status,
            date: Date.now(),
          },
        ],
      },
    }, { new: true });

    const operationIsDone = operation.status === 'done';
    const operationIsCapture = operation.type === 'capture';
    const operationIsRefund = operation.type === 'refund';
    const allIsRefunded = refundAmountAvailable[0].remainingAmount === 0;
    const trxIsCompletelyCaptured = res.outstandingBalance === 0;

    const getTransactionStatus = () => {
      // Concerne les opérations de type authorization
      if (operation.type === 'authorization') {
        return 'authorized';
      }

      // Concerne les opérations de type capture
      if (operationIsCapture) {
        if (!trxIsCompletelyCaptured) {
          return 'partial_captured';
        } return 'captured';
      }

      // Concerne les opérations de type refund
      if (operationIsRefund) {
        if (allIsRefunded) {
          return 'refunded';
        }
        return 'partial_refunded';
      }

      return 'uknown';
    };

    if (operationIsDone) {
      await Transaction(connection).update({ status: getTransactionStatus() }, { where: { id: operation.transactionId } });
      await TransactionStatusHist(connection).create({ transactionId: operation.transactionId, status: getTransactionStatus() });

      await TransactionMDb.updateOne({ transactionId: operation.transactionId }, {
        $set: {
          status: getTransactionStatus(),
        },
        $addToSet: {
          statusHist: [
            {
              status: getTransactionStatus(),
              date: Date.now(),
            },
          ],
        },
      });
    }
  });

  return Operation;
};
