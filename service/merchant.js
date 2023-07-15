const { Sequelize } = require('sequelize');
const { Merchant } = require('../db');
const ValidationError = require('../errors/ValidationError');

module.exports = {
  create: async (data) => {
    try {
      return await Merchant.create(data);
    } catch (e) {
      if (e instanceof Sequelize.ValidationError) {
        throw new ValidationError(e);
      }
      throw e;
    }
  },
  findByEmail: async (email) => Merchant.findOne({ where: { email } }),
};
