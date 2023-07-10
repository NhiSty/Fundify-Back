const db = require('./db');

try {
  db.connection.authenticate().then(() => {
    // eslint-disable-next-line no-console
    console.log('Connection has been established successfully.');
    db.connection.sync({ force: true }).then(() => {
      // eslint-disable-next-line no-console
      console.log('Database synchronized');
    });
  });
} catch (error) {
  // eslint-disable-next-line no-console
  console.error('Unable to connect to the database:', error);
}
