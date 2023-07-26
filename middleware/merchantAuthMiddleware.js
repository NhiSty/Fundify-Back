// eslint-disable-next-line import/no-extraneous-dependencies
const db = require('../db');
// eslint-disable-next-line consistent-return
module.exports = async (req, res, next) => {
  if (req.role === 'user') {
    return next();
  }
  const { merchantId } = req;

  try {
    if (merchantId) {
      const merchant = await db.Merchant.findByPk(merchantId);
      if (!merchant) {
        throw new Error('404 Not Found');
      }

      if (merchant.approved) {
        next();
      } else {
        throw new Error('403 Forbidden');
      }
    }
    next();
  } catch (error) {
    next(error);
  }
};
