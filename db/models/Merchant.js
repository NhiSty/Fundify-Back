const { Model, DataTypes } = require('sequelize');
const MerchantMongo = require('../../mongoDb/models/merchant');

module.exports = function (connection) {
  class Merchant extends Model {
    async checkPassword(password) {
      // eslint-disable-next-line global-require
      const bcrypt = require('bcrypt');
      return bcrypt.compare(password, this.password);
    }

    generateToken() {
      // eslint-disable-next-line global-require
      const jwt = require('jsonwebtoken');
      return jwt.sign({ id: this.id, approved: this.approved }, process.env.JWT_SECRET, {
        expiresIn: '1y',
      });
    }
  }

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
    contactLastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    contactFirstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    contactEmail: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    contactPhone: {
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
    clientToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    clientSecret: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    approved: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  }, {
    sequelize: connection,
    modelName: 'Merchant',
    timestamps: true,
  });

  Merchant.afterCreate(async (merchant) => {
    // On crée un utilisateur dans la base de données mongoDb
    const newMerchant = new MerchantMongo({
      companyName: merchant.companyName,
      firstName: merchant.contactFirstName,
      lastName: merchant.contactLastName,
      email: merchant.contactEmail,
      phone: merchant.contactPhone,
      approved: merchant.approved,
    });

    await newMerchant.save()
      .then(() => {
        // eslint-disable-next-line no-console
        console.log('Merchant mongoDb created');
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.log(err);
      });
  });

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

  Merchant.addHook('beforeCreate', encryptPassword);
  Merchant.addHook('beforeUpdate', encryptPassword);

  return Merchant;
};
