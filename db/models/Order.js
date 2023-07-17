const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Order extends Model {}

  Order.init({
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
      type: DataTypes.INTEGER,
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
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    cart: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    totalAmount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Order',
  });

  return Order;
};
