// eslint-disable-next-line import/no-extraneous-dependencies
const db = require('../db');
require('dotenv')
  .config();

// eslint-disable-next-line consistent-return
const jsonwebtoken = require('jsonwebtoken');

const cookieMiddleware = async (req, res, next) => {
  try {
    const { cookie } = req.headers;
    const regex = /token=([^;]*)/;
    const matches = cookie && cookie.match(regex);
    let token;

    if (matches && matches.length > 0) {
      token = matches[1].trim();
    } else {
      return next();
    }

    const decodedToken = jsonwebtoken.verify(token, `${process.env.JWT_SECRET}`);
    const {
      id,
      merchantId,
      isAdmin,
    } = decodedToken;

    if (!id) {
      throw new Error('401 Unauthorized');
    }

    if (id && isAdmin === true) {
      req.role = 'admin';
      req.userId = id;
      req.merchantId = merchantId;
      req.isAdmin = isAdmin;
    } else if (id && merchantId !== null) {
      const merchant = await db.Merchant.findByPk(merchantId);
      if (merchant && merchant.approved === true) {
        req.role = 'merchant';
        req.userId = id;
        req.merchantId = merchantId;
        req.isAdmin = isAdmin;
      } else {
        req.role = 'not-merchant';
        req.userId = id;
        req.merchantId = merchantId;
        req.isAdmin = isAdmin;
      }
    } else {
      req.role = 'nobody';
      req.userId = id;
      req.merchantId = null;
      req.isAdmin = isAdmin;
    }

    next();
  } catch (error) {
    console.log('Error:', error.message);
    next(error);
  }
};

const bearerMiddleware = async (req, res, next) => {
  if (req.role === 'admin') {
    return next();
  }

  try {
    if (!req.headers.bearer) {
      return next();
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

// eslint-disable-next-line consistent-return
const combinedMiddleware = async (req, res, next) => {
  try {
    if (req.headers.cookie) {
      await cookieMiddleware(req, res, next);
    } else if (req.headers.bearer) {
      await bearerMiddleware(req, res, next);
    } else {
      throw new Error('401 Unauthorized');
    }
  } catch (error) {
    return next(error);
  }
};

module.exports = combinedMiddleware;

