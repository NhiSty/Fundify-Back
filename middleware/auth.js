const jsonwebtoken = require('jsonwebtoken');
const db = require('../db/index');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jsonwebtoken.verify(token, `${process.env.JWT_SECRET}`);
    const { userId } = decodedToken;
    const merchand = db.Merchand.findOne({ where: { id: userId } });
    const user = db.User.findOne({ where: { id: userId } });
    if (!merchand && !user) {
      throw new Error('Invalid user ID');
    }
    next();
  } catch (error) {
    // Display error message
    res.status(401).json();
  }
};
