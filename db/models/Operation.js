const { Model, DataTypes } = require('sequelize');
const OperationStatusHist = require('./OperationStatusHist');
const OperationMDb = require('../../mongoDb/models/Operation');

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
    const newOperationMDb = new OperationMDb({
      type: operation.type,
      amount: operation.amount,
      transactionId: operation.transactionId,
    });

    await newOperationMDb.save();
  });

  // Après mise à jour d'une opération (Postgres) on met à jour l'opération correspondante (MongoDB)
  Operation.afterUpdate(async (operation) => {
    await OperationStatusHist(connection).create({
      operationId: operation.id,
      status: operation.status,
    });

    await OperationMDb.findOneAndUpdate(
      { operationId: operation.id },
      {
        type: operation.type,
        amount: operation.amount,
        transactionId: operation.transactionId,
      },
    );
  });

  // Après suppression d'une opération (Postgres) on supprime l'opération correspondante (MongoDB)
  Operation.afterDestroy(async (operation) => {
    await OperationMDb.findOneAndDelete({ operationId: operation.id });
  });

  return Operation;
};
