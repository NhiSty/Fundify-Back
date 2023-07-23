module.exports = {
  validateType: (type) => {
    const validTypeValues = ['TOTAL', 'PARTIAL'];
    return validTypeValues.includes(type);
  },
  validateAmount: (amount) => {
    if (!amount || amount === '' || typeof (amount) !== 'number') {
      return false;
    }
    return /^(\d{1,8})(\.\d{1,2})?$/.test(amount);
  },
};
