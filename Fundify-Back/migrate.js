const db = require('./db');

try {
  db.connection.authenticate().then(() => {
    // eslint-disable-next-line no-console
    console.log('Connection has been established successfully.');
    db.connection.sync({ force: true }).then(async () => {
      // eslint-disable-next-line no-console
      console.log('Database synchronized');

      // Define the user data you want to add during migration
      const userAdmin = {
        username: 'admin',
        email: 'admin@gmail.com',
        password: 'Test1234!',
        isAdmin: true,
        // Add other attributes as needed
      };

      // Create a new user in the database
      const newUser = await db.User.create(userAdmin);
      console.log('User added:', newUser.toJSON());
    });
  });
} catch (error) {
  // eslint-disable-next-line no-console
  console.error('Unable to connect to the database:', error);
}
