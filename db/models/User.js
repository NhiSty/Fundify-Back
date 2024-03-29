const {
  Model,
  DataTypes,
} = require('sequelize');
const sendEmail = require('../../utils/sendEmail');

// eslint-disable-next-line func-names
module.exports = function (connection) {
  class User extends Model {
    async checkPassword(password) {
      // eslint-disable-next-line global-require
      const bcrypt = require('bcrypt');
      return bcrypt.compare(password, this.password);
    }

    generateToken(approved) {
      // eslint-disable-next-line global-require
      const jwt = require('jsonwebtoken');
      return jwt.sign({
        id: this.id,
        merchantId: this.merchantId,
        isAdmin: this.isAdmin,
        approved,
      }, process.env.JWT_SECRET, {
        expiresIn: '1y',
      });
    }
  }

  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
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
      merchantId: {
        type: DataTypes.UUID,
        references: {
          model: 'Merchants',
          key: 'id',
        },
      },
      isAdmin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize: connection,
      modelName: 'User',
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

  User.addHook('beforeCreate', encryptPassword);
  User.addHook('beforeUpdate', encryptPassword);

  // function qui envoi un mail lorsqu'un user est créé (admin ou marchant)
  /*
    User.addHook('afterCreate', async (user) => {
      try {
        const emailTo = user.email;
        const who = `${user.firstname} ${user.lastname}`;
        await sendEmail(emailTo, who);
      } catch (error) {
        console.log(error);
      }
    });
   */

  return User;
};
