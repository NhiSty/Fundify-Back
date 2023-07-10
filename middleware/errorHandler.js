const ValidationError = require('../errors/ValidationError');

// eslint-disable-next-line func-names
module.exports = function (err, req, res, next) {
  console.error(err);
  if (err instanceof ValidationError) {
    res.status(422).json(err.errors);
  } else {
    res.status(500).json();
  }
};
