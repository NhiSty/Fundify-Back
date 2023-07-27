const rdmString = require('randomstring');
const token = require('token');
const db = require('../db/index');
const validator = require('../validator/MerchantValidator');
const merchantValidator = require('../validator/MerchantValidator');
const TransactionMDb = require('../mongoDb/models/Transaction');
const { authorize } = require('../utils/authorization');

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
      kbis,
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
      kbis,
      confirmationRedirectUrl,
      cancellationRedirectUrl,
    };
  });
  return res.status(200)
    .json({
      merchants: results,
    });
};

exports.getMerchantTransactionById = async (req, res) => {
  const { id, transactionId } = req.params;

  if (!id || !transactionId) {
    return res.sendStatus(404);
  }

  const transactions = await TransactionMDb.aggregate([{ $match: { $and: [{ transactionId }, { merchantId: id }] } }]).exec();
  return res.status(200)
    .json(transactions);
};

// eslint-disable-next-line consistent-return
exports.validateOrInvalidateMerchant = async (req, res, next) => {
  const { approved } = req.body;
  const { id: merchantId } = req.params;

  try {
    authorize(req, res, merchantId);

    if (!merchantId) {
      throw new Error('422 Unprocessable Entity');
    }

    const merchantToApprove = await db.Merchant.findOne({ where: { id: merchantId } });
    if (!merchantToApprove) {
      throw new Error('404 Not Found');
    }

    if (merchantToApprove.approved === approved) {
      throw new Error('422 Unprocessable Entity');
    }

    if (!approved) {
      if (!merchantToApprove.credentialsId) {
        throw new Error('422 Unprocessable Entity');
      }
      const oldCredentialsId = merchantToApprove.credentialsId;
      const merchantUpdated = await merchantToApprove.update({
        approved: false,
        credentialsId: null,
      });

      await db.Credential.destroy({ where: { id: oldCredentialsId } });

      return res.status(200).json(merchantUpdated);
    }

    const secret = rdmString.generate();
    token.defaults.secret = secret;

    const credentials = await db.Credential.create({
      clientSecret: secret,
      clientToken: token.generate(secret),
      clientId: merchantId,
    });

    if (!credentials) {
      throw new Error('404 Not Found');
    }

    merchantToApprove.update({
      approved: true,
      credentialsId: credentials.id,
    });

    if (!merchantToApprove) {
      throw new Error('404 Not Found');
    }
    return res.status(200).json(merchantToApprove);
  } catch (error) {
    next(error);
  }
};

exports.signup = async (req, res) => {
  if (!validator.validateEmail(req.body.contactEmail)
    || !validator.validatePassword(req.body.password)
    || !validator.validatePhoneNumber(req.body.contactPhone)
    || !validator.validateRejectUrl(req.body.cancellationRedirectUrl)
    || !validator.validateConfirmationUrl(req.body.confirmationRedirectUrl)
    || !validator.validateCurrency(req.body.currency)
    || !validator.validateFirstname(req.body.contactFirstName)
    || !validator.validateLastname(req.body.contactLastName)
    || !validator.validateSociety(req.body.companyName)) {
    return res.status(422)
      .json();
  }

  try {
    // On convertit la base64 en binaire
    const binaryData = Buffer.from(req.body.kbis, 'base64');
    const merchandCreated = await db.Merchant.create({
      contactEmail: req.body.contactEmail,
      password: req.body.password,
      contactLastName: req.body.contactLastName,
      contactFirstName: req.body.contactFirstName,
      companyName: req.body.companyName,
      kbis: binaryData,
      contactPhone: req.body.contactPhone,
      currency: req.body.currency,
      confirmationRedirectUrl: req.body.confirmationRedirectUrl,
      cancellationRedirectUrl: req.body.cancellationRedirectUrl,
    });
    if (merchandCreated) {
      return res.status(201)
        .json({
          contactEmail: merchandCreated.contactEmail,
        });
    }
  } catch (e) {
    console.log(e);
    return res.status(409)
      .json();
  }
  return res.status(500)
    .json();
};

exports.login = async (req, res) => {
  if (!validator.validateEmail(req.body.contactEmail) || !validator.validatePassword(req.body.password)) {
    return res.status(422)
      .json();
  }

  try {
    const merchand = await db.findOne({ where: { contactEmail: req.body.contactEmail } });
    if (!merchand) {
      return res.status(404)
        .json();
    }
    const valid = await merchand.checkPassword(req.body.password);

    if (!valid) {
      return res.status(401)
        .json();
    }

    const sign = merchand.generateToken();

    return res.cookie(
      'token',
      sign,
      {
        httpOnly: false,
        secure: false,
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

// eslint-disable-next-line consistent-return
exports.getMerchantTransactions = async (req, res, next) => {
  const merchantId = req.params.id;

  try {
    if (!merchantId) {
      throw new Error('422 Unprocessable Entity');
    }

    if (!req.merchantId || parseInt(req.merchantId, 10) !== parseInt(merchantId, 10)) {
      throw new Error('401 Unauthorized');
    }

    const merchant = await db.Merchant.findOne({ where: { id: merchantId } });

    if (!merchant) {
      throw new Error('404 Not Found');
    }

    const transactions = await db.Transaction.findAll({
      where: { merchantId },
    });

    return res.status(200)
      .json(transactions);
  } catch (e) {
    next(e);
  }
};

exports.updateMerchantAccount = async (req, res) => {
  const { id: merchantId } = req.params;
  const { approved, ...merchantData } = req.body;

  if (!merchantId) {
    return res.sendStatus(422);
  }

  if (merchantData.email && !merchantValidator.validateEmail(merchantData.email)) {
    return res.sendStatus(422);
  }

  if (merchantData.password && !merchantValidator.validatePassword(merchantData.password)) {
    return res.sendStatus(422);
  }

  if (merchantData.companyName && !merchantValidator.validateSociety(merchantData.companyName)) {
    return res.sendStatus(422);
  }

  if (merchantData.contactPhone && !merchantValidator.validatePhoneNumber(merchantData.contactPhone)) {
    return res.sendStatus(422);
  }

  if (merchantData.currency && !merchantValidator.validateCurrency(merchantData.currency)) {
    return res.sendStatus(422);
  }

  if (merchantData.confirmationRedirectUrl && !merchantValidator.validateConfirmationUrl(merchantData.confirmationRedirectUrl)) {
    return res.sendStatus(422);
  }

  if (merchantData.cancellationRedirectUrl && !merchantValidator.validateRejectUrl(merchantData.cancellationRedirectUrl)) {
    return res.sendStatus(422);
  }

  if (merchantData.kbis && !merchantValidator.validateKbis(merchantData.kbis)) {
    return res.sendStatus(422);
  }

  if (merchantData.domain && !merchantValidator.validateDomain(merchantData.domain)) {
    return res.sendStatus(422);
  }

  const merchantToUpdate = await db.Merchant.findOne({ where: { id: merchantId } });
  if (!merchantToUpdate) {
    return res.sendStatus(404);
  }

  const updatedMerchant = await merchantToUpdate.update(req.body, { where: { id: merchantId } });

  if (!updatedMerchant) {
    return res.sendStatus(404);
  }

  return res.status(200).json(updatedMerchant);
};

// eslint-disable-next-line consistent-return
exports.getMerchantAccount = async (req, res, next) => {
  const merchantId = req.params.id;
  try {
    if (req.role !== 'user') {
      if (parseInt(req.merchantId, 10) !== parseInt(merchantId, 10)) {
        throw new Error('401 Unauthorized');
      }
    }

    if (!req.isAdmin) {
      throw new Error('401 Unauthorized');
    }

    const merchant = await db.Merchant.findOne({ where: { id: merchantId } });
    if (!merchant) {
      throw new Error('404 Not Found');
    }

    const { password, ...rest } = merchant;

    return res.status(200).json(rest);
  } catch (e) {
    next(e);
  }
};
