const {
  Model,
  DataTypes,
} = require('sequelize');

module.exports = function (connection) {
  class Credentials extends Model {
  }

  Credentials.init({
    clientToken: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    clientSecret: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    clientId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

  }, {
    sequelize: connection,
    modelName: 'Credential',
    timestamps: true,
  });

  return Credentials;
};
