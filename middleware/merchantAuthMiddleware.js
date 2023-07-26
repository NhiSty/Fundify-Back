// eslint-disable-next-line import/no-extraneous-dependencies
const db = require('../db');

// eslint-disable-next-line consistent-return
module.exports = async (req, res, next) => {
  if (req.role !== 'merchant') {
    return next();
  }
  const merchantId = req.method === 'GET' ? req.params.id : req.body.merchantId;

  try {
    if (merchantId) {
      const merchant = await db.Merchant.findByPk(merchantId);
      if (!merchant) {
        return res.sendStatus(404);
      }

      if (merchant.approved) {
        next();
      } else {
        throw new Error('You are not allowed to access this ressource');
      }
    }
    next();
  } catch (error) {
    next(error);
  }
};
