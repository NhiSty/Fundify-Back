const { Model, DataTypes } = require('sequelize');
const TransactionMDb = require('../../mongoDb/models/Transaction');

module.exports = function (connection) {
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
        type: DataTypes.ENUM('PENDING', 'CONFIRMED', 'CANCELLED'),
        defaultValue: 'PENDING',
      },
    },
    {
      sequelize: connection,
      modelName: 'Transaction',
      timestamps: true,
    },
  );

  // Après création d'une transaction (Postgres) on crée une transaction (MongoDB)
  Transaction.afterCreate(async (transaction) => {
    const newTransactionMDb = new TransactionMDb({
      transactionId: transaction.id,
      merchantId: transaction.merchantId,
      userId: transaction.userId,
      amount: transaction.amount,
      currency: transaction.currency,
      status: transaction.status,
    });

    await newTransactionMDb.save();
  });

  // Après mise à jour d'une transaction (Postgres) on met à jour la transaction correspondante (MongoDB)
  Transaction.afterUpdate(async (transaction) => {
    await TransactionMDb.findOneAndUpdate(
      { transactionId: transaction.id },
      {
        merchantId: transaction.merchantId,
        userId: transaction.userId,
        amount: transaction.amount,
        currency: transaction.currency,
        status: transaction.status,
      },
    );
  });

  // Après suppression d'une transaction (Postgres) on supprime la transaction correspondante (MongoDB)
  Transaction.afterDestroy(async (transaction) => {
    await TransactionMDb.findOneAndDelete({ transactionId: transaction.id });
  });

  return Transaction;
};
