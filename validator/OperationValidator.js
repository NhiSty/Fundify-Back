module.exports = {
  validateType: (type) => {
    const validTypeValues = ['captured', 'refunded'];
    return validTypeValues.includes(type);
  },
  validateAmount: (amount) => {
    if (!amount || amount === '' || typeof (amount) !== 'number') {
      return false;
    }
    return /^(\d{1,8})(\.\d{1,2})?$/.test(amount);
  },
  validateStatus: (status) => {
    const validStatusValues = ['created', 'processing', 'done', 'failed'];
    return validStatusValues.includes(status);
  },
};
