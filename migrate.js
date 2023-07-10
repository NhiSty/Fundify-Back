const db = require('./db');

try {
  db.connection.authenticate().then(() => {
    console.log('Connection has been established successfully.');
    db.connection.sync({ force: true }).then(() => {
      console.log('Database synchronized');
    });
  });
} catch (error) {
  console.error('Unable to connect to the database:', error);
}
