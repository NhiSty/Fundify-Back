const db = require('../db/index');
const validator = require('../validator/MerchantValidator');

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
    return res.status(422).json();
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
      return res.status(201).json({
        contactEmail: merchandCreated.contactEmail,
      });
    }
  } catch (e) {
    console.log(e);
    return res.status(409).json();
  }
  return res.status(500).json();
};

exports.login = async (req, res) => {
  if (!validator.validateEmail(req.body.contactEmail) || !validator.validatePassword(req.body.password)) {
    return res.status(422).json();
  }

  try {
    const merchand = await db.Merchant.findOne({ where: { contactEmail: req.body.contactEmail } });
    if (!merchand) {
      return res.status(404).json();
    }
    const valid = await merchand.checkPassword(req.body.password);

    if (!valid) {
      return res.status(401).json();
    }

    const sign = merchand.generateToken();

    return res.cookie(
      'token',
      sign,
      { httpOnly: false, secure: false },
    ).status(200).json({ token: sign });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
  }
  return res.status(500).json();
};

exports.getMerchantTransactions = async (req, res) => {
  const merchantId = req.params.id;

  if (!merchantId) {
    return res.status(422).json();
  }

  const merchant = await db.Merchant.findByPk(merchantId);
  if (!merchant) {
    return res.status(404).json();
  }

  const transactions = await db.Transaction.findAll({
    where: { merchantId },
  });

  return res.status(200).json(transactions);
};

exports.getMerchantAccount = async (req, res) => {
  const merchantId = req.params.id;

  try {
    if (!merchantId) {
      return res.status(422).json();
    }
    console.log(merchantId);

    const merchant = await db.Merchant.findOne({ where: { id: merchantId } });
    console.log(merchant);
    if (!merchant) {
      return res.status(404).json();
    }
    return res.status(200).json({
      contactEmail: merchant.contactEmail,
      contactLastName: merchant.contactLastName,
      contactFirstName: merchant.contactFirstName,
      companyName: merchant.companyName,
      contactPhone: merchant.contactPhone,
      currency: merchant.currency,
      confirmationRedirectUrl: merchant.confirmationRedirectUrl,
      cancellationRedirectUrl: merchant.cancellationRedirectUrl,
      kbis: merchant.kbis,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json();
  }
};
