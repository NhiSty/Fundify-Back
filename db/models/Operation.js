const { Model, DataTypes } = require('sequelize');
const OperationMDb = require('../../mongoDb/models/Operation');

module.exports = function (connection) {
  class Operation extends Model {}

  Operation.init({
    type: {
      type: DataTypes.ENUM('TOTAL', 'PARTIAL'),
      defaultValue: 'TOTAL',
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
  }, {
    sequelize: connection,
    modelName: 'Operation',
    timestamps: true,
  });

  // Après création d'une opération (Postgres) on crée une opération (MongoDB)
  Operation.afterCreate(async (operation) => {
    const newOperationMDb = new OperationMDb({
      type: operation.type,
      amount: operation.amount,
      transactionId: operation.transactionId,
    });

    await newOperationMDb.save();
  });

  // Après mise à jour d'une opération (Postgres) on met à jour l'opération correspondante (MongoDB)
  Operation.afterUpdate(async (operation) => {
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
