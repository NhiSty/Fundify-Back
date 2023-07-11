const ValidationError = require('../errors/ValidationError');

// eslint-disable-next-line func-names,no-unused-vars
module.exports = function (err, req, res, next) {
  // eslint-disable-next-line no-console
  console.error(err);
  if (err instanceof ValidationError) {
    res.status(422).json(err.errors);
  } else {
    res.status(500).json();
  }
};
