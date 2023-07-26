const jsonwebtoken = require('jsonwebtoken');
const db = require('../db');

// eslint-disable-next-line consistent-return
module.exports = async (req, res, next) => {
  try {
    const token = req.headers.cookie.split('token=')[1];
    const decodedToken = jsonwebtoken.verify(token, `${process.env.JWT_SECRET}`);
    const {
      id,
      merchantId,
    } = decodedToken;

    if (merchantId && merchantId) {
      req.userId = merchantId;
      req.merchantId = merchantId;
      req.role = 'merchant';
      return next();
    }
    if (id && !merchantId && req.hostname === process.env.HOSTNAME) {
      req.userId = id;
      req.role = 'user';
      return next();
    }

    if (merchantId) {
      const merchant = await db.Merchant.findByPk(merchantId);
      if (merchant) {
        if (id && merchant.approved === false) {
          req.userId = id;
          req.role = 'not-merchant';
        }
      }
      return next();
    }
    if (!id) {
      throw new Error('401 Unauthorized');
    }

    next();
  } catch (error) {
    next(error);
  }
};
