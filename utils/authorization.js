exports.authorize = (req, res, merchantId) => {
  const {
    merchantId: reqMerchantId, isAdmin,
  } = req;

  console.log('reqMerchantId:', reqMerchantId);
  console.log('merchantId:', merchantId);

  if (!isAdmin) {
    if (parseInt(reqMerchantId, 10) !== parseInt(merchantId, 10)) {
      throw new Error('403 Forbidden');
    }
  }
};
