const jsonwebtoken = require('jsonwebtoken');
const db = require('../db/index');

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.cookie.split('=')[1];
    const decodedToken = jsonwebtoken.verify(token, `${process.env.JWT_SECRET}`);
    const { id } = decodedToken;
    const user = await db.User.findOne({ where: { id } });
    if (!user) {
      throw new Error('Invalid user ID');
    }

    if (user.role !== 'ADMIN') {
      console.log(user);
      throw new Error('Invalid role');
    }
    next();
  } catch (error) {
    // Display error message
    console.log(error);
    res.status(401)
      .json();
  }
};
