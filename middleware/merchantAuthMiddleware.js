const jsonwebtoken = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.cookie.split('token=')[1];
    const decodedToken = jsonwebtoken.verify(token, `${process.env.JWT_SECRET}`);
    const { id, approved, isAdmin } = decodedToken;

    // eslint-disable-next-line no-mixed-operators
    if (!id || approved === false || (isAdmin && isAdmin === false)) {
      throw new Error('Invalid ID');
    }
    next();
  } catch (error) {
    // Display error message
    res.status(401).json();
  }
};
