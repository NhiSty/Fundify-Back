// eslint-disable-next-line import/no-extraneous-dependencies
const db = require('../db');
require('dotenv')
  .config();

// eslint-disable-next-line consistent-return
module.exports = async (req, res, next) => {
  if (req.role === 'admin') {
    return next();
  }

  // @TODO remove this if statement when testing is complete
  if (req.hostname === process.env.DOMAIN_NAME) {
    return next();
  }

  console.log(req.headers.bearer);

  try {
    if (!req.headers.bearer) {
      throw new Error('403 Forbidden');
    }
    const separator = req.headers.bearer.indexOf(':');
    const merchantId = req.headers.bearer.slice(0, separator);
    const merchantToken = req.headers.bearer.split(':');

    if (merchantId) {
      const merchant = await db.Merchant.findByPk(merchantId);
      if (!merchant) {
        throw new Error('404 Not Found');
      }
      if (merchant) {
        const credentials = await db.Credential.findByPk(merchant.credentialsId);
        if (!credentials) {
          throw new Error('404 Not Found');
        }

        const tokenIsValid = credentials.clientToken === merchantToken[1];

        if (!tokenIsValid) {
          throw new Error('403 Forbidden');
        }
        return next();
      }
    }
  } catch (error) {
    return next(error);
  }
};
