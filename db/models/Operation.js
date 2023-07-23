const { Model, DataTypes } = require('sequelize');

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

  return Operation;
};
