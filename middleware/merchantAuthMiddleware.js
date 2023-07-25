const jsonwebtoken = require('jsonwebtoken');

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.cookie.split('token=')[1];
    const decodedToken = jsonwebtoken.verify(token, `${process.env.JWT_SECRET}`);
    const { id, approved, isAdmin } = decodedToken;

    console.log('id', id);
    console.log('approved', approved);
    console.log('isAdmin', isAdmin);

    // eslint-disable-next-line no-mixed-operators
    if (!id || approved === false || (isAdmin && isAdmin === false)) {
      throw new Error('Invalid ID');
    }
    return res.json({ message: 'toto' });
    // next();
  } catch (error) {
    console.log('error', error);
    // Display error message
    res.status(401).json();
  }
};
