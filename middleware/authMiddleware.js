const jsonwebtoken = require('jsonwebtoken');
const db = require('../db');
require('dotenv')
  .config();

// eslint-disable-next-line consistent-return
module.exports = async (req, res, next) => {
  try {
    const regex = /token=(.*?);/g;
    const matches = req.headers.cookie.match(regex);
    let token;

    if (matches && matches.length > 0) {
      token = matches[0].replace('token=', '').replace(';', '').trim();
    } else {
      throw new Error('401 Unauthorized');
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
      req.role = 'user';
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
