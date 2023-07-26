const TransactionMDb = require('../mongoDb/models/Transaction');

module.exports = {
  validateType: (type) => {
    const validTypeValues = ['capture', 'refund'];
    return validTypeValues.includes(type);
  },
  validateAmount: async (amount, transactionId) => {
    const transactionMdb = await TransactionMDb.findOne({ transactionId });

    if (!amount || amount === '' || typeof (amount) !== 'number' || amount > transactionMdb.refundAmountAvailable) {
      return false;
    }
    return /^(\d{1,8})(\.\d{1,2})?$/.test(amount);
  },
  validateStatus: (status) => {
    const validStatusValues = ['created', 'processing', 'done', 'failed'];
    return validStatusValues.includes(status);
  },
};
