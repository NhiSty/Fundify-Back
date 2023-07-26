const {
  Model,
  DataTypes,
} = require('sequelize');
const MerchantMongo = require('../../mongoDb/models/Merchant');

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
    contactEmail: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    domain: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
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
      allowNull: true,
    },
  }, {
    sequelize: connection,
    modelName: 'Merchant',
    timestamps: true,
  });

  // Après création d'un marchand (Postgres) on crée le marchand correspondant (MongoDB)
  Merchant.afterCreate(async (merchant) => {
    const newMerchant = new MerchantMongo({
      merchantId: merchant.id,
      companyName: merchant.companyName,
      firstName: merchant.contactFirstName,
      lastName: merchant.contactLastName,
      email: merchant.contactEmail,
      phone: merchant.contactPhone,
      approved: merchant.approved,
    });

    await newMerchant.save();
  });

  // Après mise à jour d'un marchand (Postgres) on met à jour le marchand correspondant (MongoDB)
  Merchant.afterUpdate(async (merchant) => {
    await MerchantMongo.findOneAndUpdate(
      { merchantId: merchant.id },
      {
        companyName: merchant.companyName,
        firstName: merchant.contactFirstName,
        lastName: merchant.contactLastName,
        email: merchant.contactEmail,
        phone: merchant.contactPhone,
        approved: merchant.approved,
      },
    );
  });

  // Après suppression d'un marchand (Postgres) on supprime le marchand correspondant (MongoDB)
  Merchant.afterDestroy(async (merchant) => {
    await MerchantMongo.findOneAndDelete({ merchantId: merchant.id });
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
