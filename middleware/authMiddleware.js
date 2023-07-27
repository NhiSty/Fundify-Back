const jsonwebtoken = require('jsonwebtoken');
const db = require('../db');
require('dotenv')
  .config();

// eslint-disable-next-line consistent-return
module.exports = async (req, res, next) => {
  try {
    const token = req.headers.cookie.split('token=')[1];
    const decodedToken = jsonwebtoken.verify(token, `${process.env.JWT_SECRET}`);
    const {
      id,
      merchantId,
      isAdmin,
    } = decodedToken;

    if (!id) {
      throw new Error('401 Unauthorized');
    }

    console.info('isAdmin:', isAdmin);
    console.info('id:', id);

    if (id && isAdmin === true) {
      req.role = 'user';
      req.userId = id;
      req.merchantId = merchantId;
    } else if (id && merchantId !== null) {
      const merchant = await db.Merchant.findByPk(merchantId);
      if (merchant.approved === true) {
        req.role = 'merchant';
        req.userId = id;
        req.merchantId = merchantId;
      } else {
        req.role = 'not-merchant';
        req.userId = id;
        req.merchantId = merchantId;
      }
    }
    console.log('Role:', req.role);
    console.log('UserId:', req.userId);
    console.log('MerchantId:', req.merchantId);

    next();
  } catch (error) {
    next(error);
  }
};
