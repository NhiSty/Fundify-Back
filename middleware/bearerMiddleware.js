// eslint-disable-next-line import/no-extraneous-dependencies
const db = require('../db');

// eslint-disable-next-line consistent-return
module.exports = async (req, res, next) => {
  if (req.role !== 'merchant') {
    return next();
  }
  if (!req.headers.bearer) {
    return res.sendStatus(403);
  }
  const separator = req.headers.bearer.indexOf(':');
  const merchantId = req.headers.bearer.slice(0, separator);
  const merchantToken = req.headers.bearer.split(':');

  try {
    if (merchantId) {
      const merchant = await db.Merchant.findByPk(merchantId);
      if (!merchant) {
        return res.sendStatus(404);
      }
      if (merchant) {
        const credentials = await db.Credential.findByPk(merchant.credentialsId);
        if (!credentials) {
          return res.sendStatus(404);
        }

        const tokenIsValid = credentials.clientToken === merchantToken[1];

        if (!tokenIsValid) {
          return res.sendStatus(403);
        }
        return next();
      }
    }
  } catch (error) {
    console.log(error);
    return next(error);
  }
};
