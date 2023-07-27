exports.authorize = (req, res, merchantId) => {
  const {
    merchantId: reqMerchantId, isAdmin,
  } = req;

  if (!isAdmin) {
    if (parseInt(reqMerchantId, 10) !== parseInt(merchantId, 10)) {
      throw new Error('403 Forbidden');
    }
  }
};

exports.checkRole = (req, res, role) => {
  const { role: reqRole } = req;

  if (reqRole !== role) {
    throw new Error('403 Forbidden');
  }
};
