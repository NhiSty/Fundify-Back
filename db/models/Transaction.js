const { Model, DataTypes } = require('sequelize');
const TransactionStatusHist = require('./TransactionStatusHist');

module.exports = (connection) => {
  class Transaction extends Model {}

  Transaction.init(
    {
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      merchantId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Merchants',
          key: 'id',
        },
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      currency: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('created', 'captured', 'waiting_refunded', 'partial_refunded', 'refunded', 'cancelled'),
        defaultValue: 'created',
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize: connection,
      modelName: 'Transaction',
      timestamps: true,
    },
  );

  Transaction.afterCreate(async (transaction) => {
    await TransactionStatusHist(connection).create({
      transactionId: transaction.id,
      status: transaction.status,
    });
  });

  Transaction.afterUpdate(async (transaction) => {
    await TransactionStatusHist(connection).create({
      transactionId: transaction.id,
      status: transaction.status,
    });
  });

  return Transaction;
};
