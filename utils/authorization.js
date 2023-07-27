exports.authorize = (req, res, merchantId) => {
  const {
    merchantId: reqMerchantId, isAdmin,
  } = req;

  console.log('reqMerchantId:', reqMerchantId);
  console.log('merchantId:', merchantId);
  console.log('isAdmin:', isAdmin);

  if (!isAdmin) {
    if (reqMerchantId !== merchantId) {
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
