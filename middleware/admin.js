const jsonwebtoken = require('jsonwebtoken');

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.cookie.split('token=')[1];
    const decodedToken = jsonwebtoken.verify(token, `${process.env.JWT_SECRET}`);
    const { id, isAdmin } = decodedToken;
    console.log('id', id);
    console.log('isAdmin', isAdmin);
    if (!id || isAdmin === false) {
      throw new Error('Invalid ID and role');
    }
    next();
  } catch (error) {
    // Display error message
    res.status(401)
      .json();
  }
};
