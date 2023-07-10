const db = require('../db/index');
const validator = require('../validator/UserValidator');

exports.signup = async (req, res) => {
  if (!validator.validateEmail(req.body.email) || !validator.validatePassword(req.body.password)) {
    return res.status(422).json();
  }
  try {
    const userCreated = await db.User.create({
      email: req.body.email,
      password: req.body.password,
      lastname: req.body.lastname,
      firstname: req.body.firstname,
    });
    if (userCreated) {
      return res.status(201).json({
        data: {
          email: userCreated.email,
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
    return res.status(422).json();
  }

  try {
    const user = await db.User.findOne({ where: { email: req.body.email } });
    if (!user) {
      return res.status(404).json();
    }
    const valid = await user.checkPassword(req.body.password);

    if (!valid) {
      return res.status(401).json();
    }

    return res.status(200).json({
      userId: user.id,
      token: user.generateToken(),
    });
  } catch (e) {
    console.log(e);
  }
  return res.status(500).json();
};
