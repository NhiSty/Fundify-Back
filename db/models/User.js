const { Model, DataTypes } = require('sequelize');

// eslint-disable-next-line func-names
module.exports = function (connection) {
  class User extends Model {
    async checkPassword(password) {
      // eslint-disable-next-line global-require
      const bcrypt = require('bcryptjs');
      return bcrypt.compare(password, this.password);
    }

    generateToken() {
      // eslint-disable-next-line global-require
      const jwt = require('jsonwebtoken');
      return jwt.sign({ id: this.id }, process.env.JWT_SECRET, {
        expiresIn: '1y',

      });
    }
  }

  User.init(
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
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'USER',
      },
    },
    {
      sequelize: connection,
      tableName: 'users',
    },
  );

  async function encryptPassword(user, options) {
    if (!options?.fields.includes('password')) {
      return;
    }
    // eslint-disable-next-line global-require
    const bcrypt = require('bcryptjs');
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);
    // eslint-disable-next-line no-param-reassign
    user.password = hash;
  }

  User.addHook('beforeCreate', encryptPassword);
  User.addHook('beforeUpdate', encryptPassword);

  return User;
};
