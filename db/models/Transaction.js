const { Model, DataTypes } = require('sequelize');
const TransactionStatusHist = require('./TransactionStatusHist');
const TransactionMDb = require('../../mongoDb/models/Transaction');

module.exports = (connection) => {
  class Transaction extends Model { }

  Transaction.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      merchantId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Merchants',
          key: 'id',
        },
      },
      userId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      currency: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        // eslint-disable-next-line max-len
        type: DataTypes.ENUM('created', 'captured', 'partial_captured', 'authorized', 'waiting_refund', 'partial_refunded', 'refunded', 'cancelled'),
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
      outstandingBalance: transaction.amount,
      refundAmountAvailable: transaction.amount,
      createdDate: Date.now(),
      statusHist: [
        {
          status: transaction.status,
          date: Date.now(),
        },
      ],
    });

    await newTransactionMDb.save();
  });

  // Après suppression d'une transaction (Postgres) on supprime la transaction correspondante (MongoDB)
  Transaction.afterDestroy(async (transaction) => {
    await TransactionMDb.findOneAndDelete({ transactionId: transaction.id });
  });

  return Transaction;
};
