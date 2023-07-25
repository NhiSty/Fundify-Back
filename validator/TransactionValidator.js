module.exports = {
  validateAmount: (amount) => {
    if (!amount || amount === '' || typeof (amount) !== 'number') {
      return false;
    }
    return /^(\d{1,8})(\.\d{1,2})?$/.test(amount);
  },
  validateStatus: (status) => {
    const validStatusValues = ['created', 'captured', 'waiting_refunded', 'partial_refunded', 'refunded', 'cancelled'];
    return validStatusValues.includes(status);
  },
  validateCurrency: (currency) => {
    if (!currency || currency === '' || typeof (currency) !== 'string') {
      return false;
    }
    return /^[A-Z]{3}$/.test(currency);
  },
};
