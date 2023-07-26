const rdmString = require('randomstring');
const token = require('token');
const {
  UniqueConstraintError,
  ValidationError,
} = require('sequelize');
const db = require('../db/index');
const validator = require('../validator/UserValidator');

exports.validateMarchant = async (req, res) => {
  const merchantId = req.body.id;
  console.log(merchantId);
  if (!merchantId) {
    return res.status(422)
      .json();
  }

  const secret = rdmString.generate();
  token.defaults.secret = secret;

  const merchantToApprove = await db.Merchant.findOne({ where: { id: merchantId } });

  console.log(merchantToApprove);

  if (!merchantToApprove) {
    return res.status(404)
      .json();
  }

  const credentials = await db.Credential.create({
    clientSecret: secret,
    clientToken: token.generate(secret),
    clientId: merchantId,
  });

  if (!credentials) {
    return res.status(404)
      .json();
  }

  merchantToApprove.update({
    approved: true,
    credentialsId: credentials.id,
  });

  if (!merchantToApprove) {
    return res.status(404)
      .json();
  }
  return res.status(200)
    .json({
      approved: true,
    });
};

exports.getMerchants = async (req, res) => {
  const merchants = await db.Merchant.findAll();

  const results = merchants.map((merchant) => {
    const {
      approved,
      contactEmail,
      contactLastName,
      contactFirstName,
      companyName,
      contactPhone,
      currency,
      confirmationRedirectUrl,
      cancellationRedirectUrl,
    } = merchant.dataValues;
    return {
      approved,
      contactEmail,
      contactLastName,
      contactFirstName,
      companyName,
      contactPhone,
      currency,
      confirmationRedirectUrl,
      cancellationRedirectUrl,
    };
  });
  return res.status(200)
    .json({
      merchants: results,
    });
};

exports.getTransactions = async (req, res) => {
  const transactions = await db.Transaction.findAll();
  return res.status(200)
    .json(transactions);
};

exports.getOperations = async (req, res) => {
  const operations = await db.Operation.findAll();
  return res.status(200)
    .json(operations);
};

exports.updateMerchantAccount = async (req, res) => {
  const merchantId = req.body.id;
  if (!merchantId) {
    return res.status(422)
      .json();
  }

  const merchantToUpdate = await db.Merchant.findOne({ where: { id: merchantId } });
  if (!merchantToUpdate) {
    return res.status(404)
      .json();
  }

  const updatedMerchant = await merchantToUpdate.update(req.body, { where: { id: merchantId } });
  if (!updatedMerchant) {
    return res.status(404)
      .json();
  }

  return res.status(200)
    .json({
      contactEmail: req.body.contactEmail,
      password: req.body.password,
      contactLastName: req.body.contactLastName,
      contactFirstName: req.body.contactFirstName,
      companyName: req.body.companyName,
      kbis: req.body.kbis,
      contactPhone: req.body.contactPhone,
      currency: req.body.currency,
      confirmationRedirectUrl: req.body.confirmationRedirectUrl,
      cancellationRedirectUrl: req.body.cancellationRedirectUrl,
    });
};

exports.create = async (req, res) => {
  if (!validator.validateEmail(req.body.email)
    || !validator.validatePassword(req.body.password)
    || !validator.validateLastname(req.body.lastname)
    || !validator.validateFirstname(req.body.firstname)) {
    return res.status(422)
      .json();
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
        return res.status(201)
          .json({
            email: userCreated.email,
          });
      }
    } catch (e) {
      if (e instanceof UniqueConstraintError) {
        return res.status(409)
          .json();
      }
      if (e instanceof ValidationError) {
        return res.status(422)
          .json();
      }
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
      return res.status(201)
        .json({
          data: {
            email: userCreated.email,
          },
        });
    }
  } catch (e) {
    if (e instanceof UniqueConstraintError) {
      return res.status(409)
        .json();
    }
    if (e instanceof ValidationError) {
      return res.status(422)
        .json();
    }
  }
  return res.status(500)
    .json();
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
      return res.status(404)
        .json();
    }
    const valid = await user.checkPassword(req.body.password);

    if (!valid) {
      return res.status(401)
        .json();
    }

    const sign = user.generateToken();

    return res.cookie(
      'token',
      sign,
      {
        httpOnly: false,
        secure: false,
        sameSite: 'none',
      },
    )
      .status(200)
      .json();
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
  }
  return res.status(500)
    .json();
};

exports.setAdmin = async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(422)
      .json();
  }

  const userToUpdate = await db.User.findOne({ where: { id: userId } });
  if (!userToUpdate) {
    return res.status(404)
      .json();
  }

  const updatedUser = await userToUpdate.update({ isAdmin: true }, { where: { id: userId } });

  if (!updatedUser) {
    return res.status(404)
      .json();
  }

  return res.status(200)
    .json();
};
// eslint-disable-next-line max-len
exports.logout = async (req, res) => res.clearCookie('token')
  .status(200)
  .json();
