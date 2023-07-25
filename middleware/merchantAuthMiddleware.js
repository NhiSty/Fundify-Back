const db = require('../db');
const idItsMe = require('../utils/idItsMe');
const token = require('token');

// eslint-disable-next-line consistent-return
module.exports = async (req, res, next) => {
  try {
    const {
      id,
      adminId,
      clientToken,
    } = req;

    if (!id || !adminId) {
      return res.status(422)
        .json();
    }

    const merchant = await db.Merchant.findByPk(id);
    const admin = await db.Admin.findByPk(adminId);

    if (!merchant) {
      return res.status(404)
        .json();
    }

    if (!admin) {
      return res.status(404)
        .json();
    }

    if (!idItsMe(req, merchant.id)) {
      return res.status(403)
        .json();
    }

    if (merchant) {
      const clientSecret = merchant.clientToken;


    }
  } catch (error) {
    next(error);
    // Display error message
    res.status(401)
      .json();
  }
};
