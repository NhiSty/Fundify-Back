const db = require('../db/index');

exports.validateMarchant = async (req, res) => {
  const merchantId = req.body.id;
  if (!merchantId) {
    return res.status(422).json();
  }
  const approvedMerchant = await db.Merchant.update({ approved: true }, { where: { id: merchantId } });

  if (approvedMerchant.length < 0) {
    return res.status(404).json();
  }
  return res.status(200).json({
    approved: true,
  });
};

exports.invalidateMarchant = async (req, res) => {
  const merchantId = req.body.id;
  if (!merchantId) {
    return res.status(422).json();
  }
  const approvedMerchant = await db.Merchant.update({ approved: false }, { where: { id: merchantId } });

  if (approvedMerchant.length < 0) {
    return res.status(404).json();
  }
  return res.status(200).json({
    approved: false,
  });
};

exports.getMerchants = async (req, res) => {
  const merchants = await db.Merchant.findAll();

  const results = merchants.map((merchant) => {
    const {
      contactEmail, contactLastName, contactFirstName, companyName, contactPhone, currency,
      confirmationRedirectUrl, cancellationRedirectUrl,
    } = merchant.dataValues;
    return {
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
  return res.status(200).json({
    merchants: results,
  });
};

exports.getTransactions = async (req, res) => {
  const transactions = await db.Transaction.findAll();
  return res.status(200).json(transactions);
};

exports.getOperations = async (req, res) => {
  const operations = await db.Operation.findAll();
  return res.status(200).json(operations);
};

exports.updateMerchantAccount = async (req, res) => {
  const merchantId = req.body.id;
  if (!merchantId) {
    return res.status(422).json();
  }

  const merchantToUpdate = await db.Merchant.findOne({ where: { id: merchantId } });
  if (!merchantToUpdate) {
    return res.status(404).json();
  }

  const updatedMerchant = await merchantToUpdate.update(req.body, { where: { id: merchantId } });
  if (!updatedMerchant) {
    return res.status(404).json();
  }

  return res.status(200).json({
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
