const { Model, DataTypes } = require('sequelize');
const OperationStatusHist = require('./OperationStatusHist');
const TransactionMDb = require('../../mongoDb/models/Transaction');

module.exports = (connection) => {
  class Operation extends Model {}

  Operation.init({
    type: {
      type: DataTypes.ENUM('captured', 'refunded'),
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

    await TransactionMDb.findOneAndUpdate({ transactionId: operation.transactionId }, {
      $addToSet: {
        operations: {
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
  });

  // Après mise à jour d'une opération (Postgres) on met à jour l'opération correspondante (MongoDB)
  Operation.afterUpdate(async (operation) => {
    await OperationStatusHist(connection).create({
      operationId: operation.id,
      status: operation.status,
    });
  });

  return Operation;
};
