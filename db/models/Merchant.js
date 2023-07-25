const {
  Model,
  DataTypes,
} = require('sequelize');

module.exports = function (connection) {
  class Merchant extends Model {}
  Merchant.init({
    companyName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    kbis: {
      type: DataTypes.BLOB,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    domain: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    confirmationRedirectUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cancellationRedirectUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    approved: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    credentialsId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Credentials',
        key: 'id',
      },
    },
  }, {
    sequelize: connection,
    modelName: 'Merchant',
    timestamps: true,
  });
  return Merchant;
};
