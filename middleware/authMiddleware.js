// eslint-disable-next-line import/no-extraneous-dependencies
const jsonwebtoken = require('jsonwebtoken');
const db = require('../db');
require('dotenv')
  .config();

// eslint-disable-next-line consistent-return
const authMiddleware = async (req, res, next) => {
  const tokenHeader = req.header('token');
  const bearerHeader = req.header('bearer');

  if (tokenHeader) {
    try {
      console.log('tokenHeader:', tokenHeader);
      const decodedToken = jsonwebtoken.verify(tokenHeader, `${process.env.JWT_SECRET}`);

      if (decodedToken.isAdmin) {
        req.role = 'admin';
      }

      if (decodedToken.merchantId) {
        const merchant = await db.Merchant.findByPk(decodedToken.merchantId);
        if (merchant && merchant.approved === true) {
          req.role = 'merchant';
        } else {
          req.role = 'not-merchant';
        }
      }

      req.userId = decodedToken.id;
      req.isAdmin = decodedToken.isAdmin;
      req.merchantId = decodedToken.merchantId;

      next();
    } catch (error) {
      console.log('Error:', error.message);
      throw new Error('401 Unauthorized');
    }
  } else {
    try {
      if (!bearerHeader) {
        throw new Error('401 Unauthorized');
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
          next();
        }
      }
    } catch (error) {
      console.log('Error:', error.message);
      throw new Error('401 Unauthorized');
    }
  }
};

module.exports = authMiddleware;
