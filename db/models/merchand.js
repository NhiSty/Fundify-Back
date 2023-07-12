const { Model, DataTypes } = require('sequelize');

// eslint-disable-next-line func-names
module.exports = function (connection) {
  class Merchand extends Model {
    async checkPassword(password) {
      // eslint-disable-next-line global-require,no-shadow
      const bcrypt = require('bcrypt');
      return bcrypt.compare(password, this.password);
    }

    generateToken() {
      // eslint-disable-next-line global-require,no-shadow
      const jwt = require('jsonwebtoken');
      return jwt.sign({ id: this.id }, process.env.JWT_SECRET, {
        expiresIn: '1y',
      });
    }
  }

  Merchand.init(
    {
      lastname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      firstname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          isEmail: true,
          isNotNull(value) {
            if (value === null) {
              throw new Error('Email cannot be null');
            }
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          min: 8,
        },
      },
      society: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      kbis: { type: DataTypes.STRING, allowNull: false },
      phone: { type: DataTypes.STRING, allowNull: false },
      confirmationUrl: { type: DataTypes.STRING, allowNull: true },
      rejectUrl: { type: DataTypes.STRING, allowNull: true },
      currency: { type: DataTypes.STRING, allowNull: false },
      confirmation: { type: DataTypes.BOOLEAN, allowNull: true },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'MERCHAND',
      },

    },
    {
      sequelize: connection,
      tableName: 'merchands',
    },
  );

  async function encryptPassword(user, options) {
    if (!options?.fields.includes('password')) {
      return;
    }
    // eslint-disable-next-line global-require
    const bcrypt = require('bcrypt');
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);
    // eslint-disable-next-line no-param-reassign
    user.password = hash;
  }

  Merchand.addHook('beforeCreate', encryptPassword);
  Merchand.addHook('beforeUpdate', encryptPassword);

  return Merchand;
};
