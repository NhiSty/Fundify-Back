const { Model, DataTypes } = require('sequelize');

// eslint-disable-next-line func-names
module.exports = function (connection) {
  class Admin extends Model {
    async checkPassword(password) {
      // eslint-disable-next-line global-require
      const bcrypt = require('bcrypt');
      return bcrypt.compare(password, this.password);
    }

    generateToken() {
      // eslint-disable-next-line global-require
      const jwt = require('jsonwebtoken');
      return jwt.sign({ id: this.id, isAdmin: this.isAdmin }, process.env.JWT_SECRET, {
        expiresIn: '1y',
      });
    }
  }

  Admin.init(
    {
      lastname: DataTypes.STRING,
      firstname: DataTypes.STRING,
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
      isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize: connection,
      modelName: 'Admin',
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

  Admin.addHook('beforeCreate', encryptPassword);
  Admin.addHook('beforeUpdate', encryptPassword);

  return Admin;
};
