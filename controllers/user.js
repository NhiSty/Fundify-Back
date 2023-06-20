const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const validator = require('../validator/UserValidator');

exports.signup = async (req, res) => {
  if (!validator.validateEmail(req.body.email) || !validator.validatePassword(req.body.password)) {
    return res.status(400).json();
  }
  try {
    const password = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      email: req.body.email,
      password,
    });
    const userCreated = await user.save();
    if (userCreated) {
      return res.status(201).json({
        data: {
          email: userCreated.email,
          userId: userCreated.id,
        },
      });
    }
  } catch (e) {
    return res.status(409).json({ message: 'Email already used' });
  }
  return res.status(500).json();
};

exports.login = async (req, res) => {
  if (!validator.validateEmail(req.body.email) || !validator.validatePassword(req.body.password)) {
    return res.status(400).json();
  }

  try {
    const user = await User.findOne({ email: req.body.email.toString() });
    if (!user) {
      return res.status(401).json();
    }
    const valid = await bcrypt.compare(req.body.password, user.password);

    if (!valid) {
      return res.status(401).json();
    }

    return res.status(200).json({
      userId: user.id,
      token: jwt.sign(
        { userId: user.id },
        `${process.env.JWT_SECRET}`,
        { expiresIn: '24h' },
      ),
    });
  } catch (e) {
    console.log(e);
  }
  return res.status(500).json();
};
