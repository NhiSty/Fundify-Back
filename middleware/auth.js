const jsonwebtoken = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.cookie.split('token=')[1];
    const decodedToken = jsonwebtoken.verify(token, `${process.env.JWT_SECRET}`);
    const { id } = decodedToken;
    if (!id) {
      throw new Error('Invalid ID');
    }
    next();
  } catch (error) {
    // Display error message
    res.status(401).json();
  }
};
