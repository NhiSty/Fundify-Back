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
