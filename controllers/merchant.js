const rdmString = require('randomstring');
const token = require('token');
const db = require('../db/index');
const merchantValidator = require('../validator/MerchantValidator');
const TransactionMDb = require('../mongoDb/models/Transaction');
const sendEmail = require('../utils/sendEmail');

// eslint-disable-next-line consistent-return
exports.getMerchants = async (req, res, next) => {
  try {
    if (req.role !== 'admin') {
      return res.sendStatus(401);
    }
    const merchants = await db.Merchant.findAll();

    const results = merchants.map((merchant) => {
      const {
        id,
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
        id,
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
  } catch (err) {
    next(err);
  }
};

// eslint-disable-next-line consistent-return
exports.getMerchantTransactionById = async (req, res, next) => {
  const { id, transactionId } = req.params;

  try {
    if (!id || !transactionId) {
      return res.sendStatus(404);
    }

    const transactions = await TransactionMDb.aggregate([{ $match: { $and: [{ transactionId }, { merchantId: id }] } }]).exec();
    return res.status(200)
      .json(transactions);
  } catch (err) {
    next(err);
  }
};

// eslint-disable-next-line consistent-return
exports.validateOrInvalidateMerchant = async (req, res, next) => {
  const { approved } = req.body;
  const { id: merchantId } = req.params;

  try {
    if (req.role !== 'admin') {
      return res.sendStatus(401);
    }

    if (!merchantId) {
      throw new Error('422 Unprocessable Entity');
    }

    const merchantToApprove = await db.Merchant.findOne({ where: { id: merchantId } });
    if (!merchantToApprove) {
      throw new Error('404 Not Found');
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

// eslint-disable-next-line consistent-return
exports.regenerateCredentials = async (req, res, next) => {
  const { id: merchantId } = req.params;

  try {
    if (!merchantId) {
      throw new Error('422 Unprocessable Entity');
    }

    const merchantToRegenerateCredentials = await db.Merchant.findOne({ where: { id: merchantId } });
    if (!merchantToRegenerateCredentials) {
      throw new Error('404 Not Found');
    }

    const secret = rdmString.generate();
    token.defaults.secret = secret;

    const credentialsToRegenerate = await db.Credential.findOne({ where: { clientId: merchantId } });
    if (!credentialsToRegenerate) {
      throw new Error('404 Not Found');
    }

    const credentials = await credentialsToRegenerate.update({
      clientSecret: secret,
      clientToken: token.generate(secret),
    });

    if (!credentials) {
      throw new Error('404 Not Found');
    }

    return res.status(200).json(credentials);
  } catch (error) {
    next(error);
  }
};

// eslint-disable-next-line consistent-return
exports.getMerchantTransactions = async (req, res, next) => {
  const merchantId = req.params.id;

  try {
    if (!merchantId) {
      throw new Error('422 Unprocessable Entity');
    }

    if (!req.isAdmin) {
      if (!req.merchantId || req.merchantId !== merchantId) {
        throw new Error('401 Unauthorized');
      }
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

// eslint-disable-next-line consistent-return
exports.updateMerchantAccount = async (req, res, next) => {
  const { id: merchantId } = req.params;
  const { approved, ...merchantData } = req.body;

  try {
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
  } catch (e) {
    next(e);
  }
};

// eslint-disable-next-line consistent-return
exports.getMerchantAccount = async (req, res, next) => {
  const merchantId = req.params.id;

  try {
    if (req.role !== 'admin') {
      if (req.merchantId !== merchantId) {
        throw new Error('401 Unauthorized');
      }
    }

    const merchant = await db.Merchant.findOne({ where: { id: merchantId } });
    if (!merchant) {
      throw new Error('404 Not Found');
    }

    const credentials = await db.Credential.findOne({ where: { id: merchant.credentialsId } });
    if (!credentials) {
      throw new Error('404 Not Found');
    }

    return res.status(200)
      .json({
        id: merchant.id,
        contactEmail: merchant.contactEmail,
        contactLastName: merchant.contactLastName,
        contactFirstName: merchant.contactFirstName,
        companyName: merchant.companyName,
        contactPhone: merchant.contactPhone,
        currency: merchant.currency,
        confirmationRedirectUrl: merchant.confirmationRedirectUrl,
        cancellationRedirectUrl: merchant.cancellationRedirectUrl,
        kbis: merchant.kbis,
        clientToken: credentials.clientToken,
        clientSecret: credentials.clientSecret,
        autoCapture: merchant.autoCapture,
      });
  } catch (e) {
    next(e);
  }
};
