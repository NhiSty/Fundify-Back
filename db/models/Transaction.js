const { Model, DataTypes } = require('sequelize');
const TransactionStatusHist = require('./TransactionStatusHist');
const TransactionMDb = require('../../mongoDb/models/Transaction');

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

  // Après création d'une transaction (Postgres) on crée une transaction (MongoDB)
  Transaction.afterCreate(async (transaction) => {
    await TransactionStatusHist(connection).create({
      transactionId: transaction.id,
      status: transaction.status,
    });

    const newTransactionMDb = new TransactionMDb({
      transactionId: transaction.id,
      merchantId: transaction.merchantId,
      userId: transaction.userId,
      amount: transaction.amount,
      currency: transaction.currency,
      status: transaction.status,
      statusHist: [
        {
          status: transaction.status,
          date: Date.now(),
        },
      ],
    });

    await newTransactionMDb.save();
  });

  // Après mise à jour d'une transaction (Postgres) on met à jour la transaction correspondante (MongoDB)
  Transaction.afterUpdate(async (transaction) => {
    await TransactionStatusHist(connection).create({
      transactionId: transaction.id,
      status: transaction.status,
    });
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
