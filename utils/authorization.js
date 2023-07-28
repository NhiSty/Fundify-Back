exports.authorize = (req, res, merchantId, domain = true) => {
  const {
    merchantId: reqMerchantId, isAdmin,
  } = req;

  console.log('domain:', domain);
  console.log('reqMerchantId:', reqMerchantId);
  console.log('merchantId:', merchantId);
  console.log('isAdmin:', isAdmin);

  if (!isAdmin && !domain) {
    console.log('403 encore Forbidden');
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
