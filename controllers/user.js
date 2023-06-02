/**
 * @file User controller for MongoDB database.
 * @module controllers/user
 * @requires models/User
 */

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Creates a new user in the database.
 * @function signup
 * @param {*} req - Express request object
 * @param {*} res - Express response object
 * @returns {Object} - Status code and message
 */
exports.signup = (req, res) => {
  switch (true) {
    case !req.body.email:
      return res.status(400).json({ error: 'Email is missing' });
    case req.body.email === '':
      return res.status(400).json({ error: 'Email is empty' });
    case !/^[a-z0-9._-]+@[a-z0-9._-]{2,}\.[a-z]{2,4}$/.test(req.body.email):
      return res.status(400).json({ error: 'Email is not valid, please enter a valid email' });
    case !req.body.password:
      return res.status(400).json({ error: 'Password is missing' });
    case req.body.password === '':
      return res.status(400).json({ error: 'Password is empty' });
    case !/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/.test(req.body.password):
      return res.status(400).json({ error: 'Password must contain at least 8 characters, 1 uppercase letter, 1 lowercase letter and 1 number' });
    case process.env.JWT_SECRET === undefined:
      return res.status(500).json({ error: 'Internal server error, please try again later' });
    default:
      break;
  }

  return bcrypt.hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      return user.save()
        .then(() => res.status(201).json({
          message: 'User created successfully!',
          data: {
            email: user.email,
            userId: user.id,
          },
        }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

/**
 * Checks if the user exists in the database and if the password is correct, then returns a token.
 * @function login
 * @param {*} req - Express request object
 * @param {*} res - Express response object
 * @returns {Object} - Status code and message
 */
exports.login = (req, res) => {
  User.findOne({ email: req.body.email.toString() })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: 'Your email or password is incorrect' });
      }
      return bcrypt.compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ error: 'Your email or password is incorrect' });
          }
          return res.status(200).json({
            userId: user.id,
            token: jwt.sign(
              { userId: user.id },
              `${process.env.JWT_SECRET}`,
              { expiresIn: '24h' },
            ),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    });
};
