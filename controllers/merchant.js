const rdmString = require('randomstring');
const token = require('token');
const db = require('../db/index');
const merchantValidator = require('../validator/MerchantValidator');
const TransactionMDb = require('../mongoDb/models/Transaction');
const { authorize, checkRole } = require('../utils/authorization');

// eslint-disable-next-line consistent-return
exports.getMerchants = async (req, res, next) => {
  try {
    checkRole(req, res, 'admin');
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
    authorize(req, res, id);

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
    checkRole(req, res, next, 'admin');

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

// eslint-disable-next-line consistent-return
exports.getMerchantTransactions = async (req, res, next) => {
  const merchantId = req.params.id;

  try {
    authorize(req, res, merchantId);

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

// eslint-disable-next-line consistent-return
exports.updateMerchantAccount = async (req, res, next) => {
  const { id: merchantId } = req.params;
  const { approved, ...merchantData } = req.body;

  try {
    authorize(req, res, merchantId);

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
    authorize(req, res, merchantId);

    if (req.role !== 'admin') {
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
