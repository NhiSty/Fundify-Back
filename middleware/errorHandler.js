module.exports = function handler(err, req, res, next) {
  switch (err.message) {
    case '404 Not Found':
      return res.sendStatus(404);
    case '403 Forbidden':
      return res.sendStatus(403);
    case '401 Unauthorized':
      return res.sendStatus(401);
    case '422 Unprocessable Entity':
      return res.sendStatus(422);
    case '409 Conflict':
      return res.sendStatus(409);
    default:
      console.log(err);
      break;
  }
  return next();
};
