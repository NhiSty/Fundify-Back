const { DataTypes } = require('sequelize');
const sequelize = require('../index');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  customerName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  customerEmail: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  billingAddress: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  billingCity: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  billingZip: {
    type: DataTypes.NUMBER,
    allowNull: false,
  },
  deliveryAddress: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  deliveryCity: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  deliveryZip: {
    type: DataTypes.NUMBER,
    allowNull: false,
  },
  cart: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  totalAmount: {
    type: DataTypes.NUMBER,
    allowNull: false,
  },
});

module.exports = Order;
