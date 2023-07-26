const { Model, DataTypes } = require('sequelize');

module.exports = (connection) => {
  class OperationStatusHist extends Model {}

  OperationStatusHist.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      operationId: {
        type: DataTypes.UUID,
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
