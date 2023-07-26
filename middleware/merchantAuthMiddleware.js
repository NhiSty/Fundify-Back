// eslint-disable-next-line import/no-extraneous-dependencies
const db = require('../db');

// eslint-disable-next-line consistent-return
module.exports = async (req, res, next) => {
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
        console.log('Merchant not approved');
        return res.sendStatus(403);
      }
    }
    next();
  } catch (error) {
    next(error);
    // Display error message
    res.status(401)
      .json();
  }
};
