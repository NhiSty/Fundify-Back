const {
  UniqueConstraintError,
  ValidationError,
} = require('sequelize');
const db = require('../db/index');
const validator = require('../validator/UserValidator');

// eslint-disable-next-line consistent-return
exports.getUsers = async (req, res, next) => {
  try {
    if (req.role !== 'admin') {
      return res.sendStatus(401);
    }
    const users = await db.User.findAll({ where: { merchantId: null } });
    return res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { email, lastname, firstname } = req.body;

  if (!validator.validateEmail(email)
    || !validator.validateLastname(lastname)
    || !validator.validateFirstname(firstname)) {
    return res.sendStatus(422);
  }

  const user = await db.User.findOne({ where: { id } });
  if (!user) {
    return res.sendStatus(404);
  }

  const userUpdated = await user.update({
    email,
    lastname,
    firstname,
  });

  if (!userUpdated) {
    return res.sendStatus(404);
  }

  return res.status(200).json(userUpdated);
};

exports.create = async (req, res) => {
  if (!validator.validateEmail(req.body.email)
    || !validator.validatePassword(req.body.password)
    || !validator.validateLastname(req.body.lastname)
    || !validator.validateFirstname(req.body.firstname)) {
    return res.sendStatus(422);
  }
  const merchantData = { ...req.body };

  if (merchantData.kbis) {
    try {
      const merchant = await db.Merchant.create({
        contactEmail: merchantData.contactEmail,
        companyName: merchantData.companyName,
        kbis: merchantData.kbis,
        contactPhone: merchantData.contactPhone,
        currency: merchantData.currency,
        confirmationRedirectUrl: merchantData.confirmationRedirectUrl,
        cancellationRedirectUrl: merchantData.cancellationRedirectUrl,
        domain: merchantData.domain,
      });

      if (!merchant) {
        return res.sendStatus(422);
      }

      const userCreated = await db.User.create({
        email: merchantData.email,
        password: merchantData.password,
        lastname: merchantData.lastname,
        firstname: merchantData.firstname,
        merchantId: merchant.id,
      });

      if (userCreated) {
        return res.status(201).json(userCreated);
      }
      return res.sendStatus(500);
    } catch (e) {
      console.log(e);
      if (e instanceof UniqueConstraintError) {
        return res.sendStatus(409);
      }
      if (e instanceof ValidationError) {
        return res.sendStatus(422);
      }
      console.log(e);
      return res.sendStatus(500);
    }
  }

  try {
    const userCreated = await db.User.create({
      email: req.body.email,
      password: req.body.password,
      lastname: req.body.lastname,
      firstname: req.body.firstname,
    });
    if (userCreated) {
      return res.status(201).json(userCreated);
    }
  } catch (e) {
    console.log(e);
    if (e instanceof UniqueConstraintError) {
      return res.sendStatus(409);
    }
    if (e instanceof ValidationError) {
      return res.sendStatus(422);
    }
  }
  return res.sendStatus(500);
};

exports.login = async (req, res) => {
  if (!validator.validateEmail(req.body.email)
    || !validator.validatePassword(req.body.password)) {
    return res.status(422)
      .json();
  }

  try {
    const user = await db.User.findOne({ where: { email: req.body.email } });
    if (!user) {
      return res.status(401).json();
    }
    const valid = await user.checkPassword(req.body.password);

    if (!valid) {
      return res.status(401)
        .json();
    }

    let sign;

    if (user.merchantId !== null) {
      const merchant = await db.Merchant.findOne({ where: { id: user.merchantId } });
      if (!merchant) {
        return res.status(401).json();
      }
      sign = user.generateToken(merchant.approved);
    } else {
      sign = await user.generateToken();
    }

    return res.json({
      token: sign,
    })
      .status(200);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
  }
  return res.status(500)
    .json();
};

// eslint-disable-next-line consistent-return
exports.setAdmin = async (req, res, next) => {
  const { userId } = req.body;

  try {
    if (req.role !== 'admin') {
      return res.sendStatus(401);
    }

    if (!userId) {
      return res.sendStatus(422);
    }

    const userToUpdate = await db.User.findOne({ where: { id: userId } });
    if (!userToUpdate) {
      return res.sendStatus(404);
    }

    const updatedUser = await userToUpdate.update({ isAdmin: true }, { where: { id: userId } });

    if (!updatedUser) {
      return res.sendStatus(404);
    }

    return res.sendStatus(200);
  } catch (e) {
    next(e);
  }
};
// eslint-disable-next-line max-len
exports.logout = async (req, res) => res.clearCookie('token')
  .status(200)
  .json();
