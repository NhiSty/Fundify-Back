const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
require('dotenv').config();

const connection = new Sequelize(process.env.PG_DATABASE_URL, {
  dialect: 'postgres',
});
const db = {
  connection,
};

fs.readdirSync(path.join(__dirname, 'models')).forEach((file) => {
  // eslint-disable-next-line global-require,import/no-dynamic-require
  const model = require(path.join(__dirname, 'models', file))(connection, Sequelize.DataTypes);
  db[model.name] = model;
  // eslint-disable-next-line no-console
  // console.log(model.name, model.prototype.constructor.name);
});

module.exports = db;
