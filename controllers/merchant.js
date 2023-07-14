const db = require('../db/index');
const validator = require('../validator/UserValidator');
const merchantService = require('../service/merchant');

exports.signup = async (req, res) => {
  if (!validator.validateEmail(req.body.email) || !validator.validatePassword(req.body.password)) {
    return res.status(422).json();
  }
  const existingMerchant = await merchantService.findByEmail(req.body.email);
  if (existingMerchant) {
    return res.status(409).json({ message: 'Email already used' });
  }

  try {
    const merchantCreated = await merchantService.create({
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
    if (merchantCreated) {
      return res.status(201).json({
        data: merchantCreated,
      });
    }
  } catch (e) {
    return res.status(500).json();
  }
  return res.status(500).json();
};

exports.login = async (req, res) => {
  if (!validator.validateEmail(req.body.email) || !validator.validatePassword(req.body.password)) {
    return res.status(422).json();
  }

  try {
    const merchant = await db.Merchant.findOne({ where: { email: req.body.email } });
    if (!merchant) {
      return res.status(404).json();
    }
    const valid = await merchant.checkPassword(req.body.password);

    if (!valid) {
      return res.status(401).json();
    }

    return res.status(200).json({
      userId: merchant.id,
      token: merchant.generateToken(),
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
  }
  return res.status(500).json();
};
