const data = require('../currency_data.json');

module.exports = {
  validateAmount: (amount) => {
    if (!amount || amount === '' || typeof (amount) !== 'number') {
      return false;
    }
    return /^(\d{1,8})(\.\d{1,2})?$/.test(amount);
  },
  validateStatus: (status) => {
    const validStatusValues = ['created', 'captured', 'waiting_refund', 'authorized', 'partial_refunded', 'refunded', 'cancelled'];
    return validStatusValues.includes(status);
  },
  validateCurrency: (currency) => {
    const uniqueCurrencies = new Set();

    for (const entry in data) {
      if (entry.includes('/')) {
        const currencies = entry.split('/');
        for (const currency of currencies) {
          uniqueCurrencies.add(currency);
        }
      }
    }
    const currencies = Array.from(uniqueCurrencies);
    // If the currency is not in the list of supported currencies, return false
    if (!currencies.includes(currency)) {
      return false;
    }
    return /^[A-Z]{3}$/.test(currency);
  },
};
