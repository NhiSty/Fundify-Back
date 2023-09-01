const TransactionMDb = require('../mongoDb/models/Transaction');

module.exports = {
  validateType: (type) => {
    const validTypeValues = ['capture', 'refund'];
    return validTypeValues.includes(type);
  },
  validateAmount: async (amount, transactionId) => {
    const transactionMdb = await TransactionMDb.findOne({ transactionId });

    if (!amount || amount === '' || typeof (amount) !== 'number') {
      return false;
    }

    if (transactionMdb.status === 'partial_captured' || transactionMdb.status === 'authorized') {
      if (transactionMdb.outstandingBalance - amount >= 0) {
        return true;
      }
      return false;
    }

    if (transactionMdb.status === 'partial_refunded' || transactionMdb.status === 'captured') {
      if (transactionMdb.refundAmountAvailable - amount >= 0) {
        return true;
      }
      return false;
    }

    return /^(\d{1,8})(\.\d{1,2})?$/.test(amount);
  },
  validateStatus: (status) => {
    const validStatusValues = ['created', 'processing', 'done', 'failed'];
    return validStatusValues.includes(status);
  },
};
