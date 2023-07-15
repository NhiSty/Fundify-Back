const jsonwebtoken = require('jsonwebtoken');
const db = require('../db/index');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.cookie.split('=')[1];
    const decodedToken = jsonwebtoken.verify(token, `${process.env.JWT_SECRET}`);
    const { id } = decodedToken;
    const merchant = db.Merchant.findOne({ where: { id } });
    const user = db.User.findOne({ where: { id } });
    if (!merchant && !user) {
      throw new Error('Invalid user ID');
    }
    next();
  } catch (error) {
    // Display error message
    res.status(401).json();
  }
};
