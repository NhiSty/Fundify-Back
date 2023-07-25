const { Model, DataTypes } = require('sequelize');

module.exports = (connection) => {
  class OperationStatusHist extends Model {}

  OperationStatusHist.init(
    {
      operationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Operations',
          key: 'id',
        },
      },
      status: {
        type: DataTypes.ENUM('created', 'processing', 'done', 'failed'),
        defaultValue: 'created',
      },
    },
    {
      sequelize: connection,
      modelName: 'OperationStatusHist',
      timestamps: true,
    },
  );

  return OperationStatusHist;
};
