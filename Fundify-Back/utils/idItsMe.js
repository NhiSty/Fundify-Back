const jsonwebtoken = require('jsonwebtoken');

module.exports = function idItsMe(req, id) {
  const token = req.headers.cookie.split('token=')[1];
  const decodedToken = jsonwebtoken.verify(token, `${process.env.JWT_SECRET}`);
  const { id: idToken } = decodedToken;
  const idUser = parseInt(id, 10);
  const idTokenInt = parseInt(idToken, 10);

  return idUser !== idTokenInt;
};
