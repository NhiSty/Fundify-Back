const jsonwebtoken = require('jsonwebtoken');

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.cookie.split('token=')[1];
    const decodedToken = jsonwebtoken.verify(token, `${process.env.JWT_SECRET}`);
    const { id, approved, isAdmin } = decodedToken;

    if (!id || approved === false || isAdmin === false) {
      throw new Error('Invalid ID and role and approved');
    }
    next();
  } catch (error) {
    // Display error message
    res.status(401)
      .json();
  }
};
