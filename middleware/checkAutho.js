const jwt = require('jsonwebtoken');
const db = require('../db');
require('dotenv').config();

// eslint-disable-next-line consistent-return
const checkAutho = (isJwtNeeded, isBearerTokenNeeded) => async (req, res, next) => {
  try {
    const { token } = req.headers;
    const bearer = req.headers.authorization || req.headers.Authorization;

    const tokenValue = bearer ? bearer.split(' ')[1] : token;

    if (isJwtNeeded && isBearerTokenNeeded) {
      if (!bearer && !token) {
        throw new Error('401 Unauthorized');
      }

      if (!tokenValue) {
        throw new Error('401 Unauthorized');
      }

      if (bearer) {
        const separator = tokenValue.indexOf(':');
        const merchantId = tokenValue.slice(0, separator);
        const merchantToken = tokenValue.split(':');

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
      } else {
        const decodedToken = jwt.verify(tokenValue, process.env.JWT_SECRET);

        const {
          id,
          merchantId,
          isAdmin,
        } = decodedToken;

        if (!id) {
          throw new Error('401 Unauthorized');
        }

        if (isAdmin) {
          req.role = 'admin';
        } else if (merchantId !== null) {
          const merchant = await db.Merchant.findByPk(merchantId);
          if (merchant && merchant.approved === true) {
            req.role = 'merchant';
          } else {
            req.role = 'not-merchant';
          }
        } else {
          req.role = 'nobody';
        }

        req.userId = id;
        req.merchantId = merchantId;
        req.isAdmin = isAdmin;
        return next();
      }
    }
    if (isJwtNeeded) {
      if (!tokenValue) {
        throw new Error('401 Unauthorized');
      }
      const decodedToken = jwt.verify(tokenValue, process.env.JWT_SECRET);
      const {
        id,
        merchantId,
        isAdmin,
      } = decodedToken;

      if (!id) {
        throw new Error('401 Unauthorized');
      }

      if (isAdmin) {
        req.role = 'admin';
      } else if (merchantId !== null) {
        const merchant = await db.Merchant.findByPk(merchantId);
        if (merchant && merchant.approved === true) {
          req.role = 'merchant';
        } else {
          req.role = 'not-merchant';
        }
      } else {
        req.role = 'nobody';
      }

      req.userId = id;
      req.merchantId = merchantId;
      req.isAdmin = isAdmin;

      return next();
    }
    throw new Error('401 Unauthorized');
  } catch (error) {
    console.log(error);
    return res.sendStatus(401);
  }
};

module.exports = checkAutho;
