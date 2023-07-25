const jsonwebtoken = require('jsonwebtoken');

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.cookie.split('token=')[1];
    const decodedToken = jsonwebtoken.verify(token, `${process.env.JWT_SECRET}`);
    const {
      approved,
      isAdmin,
    } = decodedToken;

    if (!approved || !isAdmin) {
      throw new Error('You are not allowed to access this ressource');
    }
    next();
  } catch (error) {
    next(error);
    res.status(401).json();
  }
};
