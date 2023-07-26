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

// eslint-disable-next-line consistent-return
exports.getMerchantAccount = async (req, res, next) => {
  const merchantId = req.params.id;
  try {
    if (!req.merchantId || parseInt(req.merchantId, 10) !== parseInt(merchantId, 10)) {
      throw new Error('401 Unauthorized');
    }

    const merchant = await db.Merchant.findOne({ where: { id: req.merchantId } });

    if (!merchant) {
      throw new Error('404 Not Found');
    }

    return res.status(200)
      .json({
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
    next(e);
  }
};

exports.updateMerchant = async (req, res) => {
  /* if (admin) {
     merchantToUpdate.update(req.body, { where: { id } });
   }

   req.body.approved = merchantToUpdate.approved;
   merchantToUpdate.update(req.body, { where: { id } });

   return res.status(200); */
};
