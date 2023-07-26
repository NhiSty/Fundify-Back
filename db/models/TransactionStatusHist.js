const { Model, DataTypes } = require('sequelize');

module.exports = function (connection) {
  class TransactionStatusHist extends Model {}

  TransactionStatusHist.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      transactionId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Transactions',
          key: 'id',
        },
      },
      status: {
        type: DataTypes.ENUM('created', 'captured', 'waiting_refund', 'partial_refunded', 'refunded', 'cancelled'),
        defaultValue: 'created',
      },
    },
    {
      sequelize: connection,
      modelName: 'TransactionStatusHist',
      timestamps: true,
    },
  );

  return TransactionStatusHist;
};
