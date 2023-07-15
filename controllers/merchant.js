const db = require('../db/index');
const validator = require('../validator/UserValidator');

exports.signup = async (req, res) => {
  if (!validator.validateEmail(req.body.email) || !validator.validatePassword(req.body.password)) {
    return res.status(422).json();
  }

  try {
    const merchandCreated = await db.Merchant.create({
      email: req.body.email,
      password: req.body.password,
      lastname: req.body.lastname,
      firstname: req.body.firstname,
      society: req.body.society,
      kbis: req.body.kbis,
      phone: req.body.phone,
      currency: req.body.currency,
      rejectUrl: req.body.rejectUrl,
      confirmationUrl: req.body.confirmationUrl,
    });
    if (merchandCreated) {
      return res.status(201).json({
        data: {
          email: merchandCreated.email,
        },
      });
    }
  } catch (e) {
    console.log(e);
    return res.status(409).json({ message: 'Email already used' });
  }
  return res.status(500).json();
};

exports.login = async (req, res) => {
  if (!validator.validateEmail(req.body.email) || !validator.validatePassword(req.body.password)) {
    return res.status(422).json();
  }

  try {
    const merchand = await db.Merchant.findOne({ where: { email: req.body.email } });
    if (!merchand) {
      return res.status(404).json();
    }
    const valid = await merchand.checkPassword(req.body.password);

    if (!valid) {
      return res.status(401).json();
    }

    return res.status(200).json({
      userId: merchand.id,
      token: merchand.generateToken(),
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
  }
  return res.status(500).json();
};
