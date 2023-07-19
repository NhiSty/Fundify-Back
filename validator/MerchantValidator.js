module.exports = {
  validateEmail: (email) => {
    if (!email || email === '') {
      return false;
    }
    return /^[a-z0-9._-]+@[a-z0-9._-]{2,}\.[a-z]{2,4}$/.test(email);
  },
  validatePassword: (password) => {
    if (!password || password === '' || password.length < 8) {
      return false;
    }
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/.test(password);
  },
  validateLastname: (lastname) => {
    if (!lastname || lastname === '' || typeof (lastname) !== 'string') {
      return false;
    }
    return true;
  },
  validateFirstname: (firstname) => {
    if (!firstname || firstname === '' || typeof (firstname) !== 'string') {
      return false;
    }
    return true;
  },
  validateSociety: (society) => {
    if (!society || society === '' || typeof (society) !== 'string') {
      return false;
    }
    return true;
  },
  validatePhoneNumber: (phoneNumber) => {
    if (!phoneNumber || phoneNumber === '' || typeof (phoneNumber) !== 'string') {
      return false;
    }
    return /^((\+)33|0)[1-9](\d{2}){4}$/.test(phoneNumber);
  },
  validateConfirmationUrl: (confirmationUrl) => {
    if (!confirmationUrl || confirmationUrl === '' || typeof (confirmationUrl) !== 'string') {
      return false;
    }
    return /^(http|https):\/\/[^ "]+$/.test(confirmationUrl);
  },
  validateRejectUrl: (rejectUrl) => {
    if (!rejectUrl || rejectUrl === '' || typeof (rejectUrl) !== 'string') {
      return false;
    }
    return /^(http|https):\/\/[^ "]+$/.test(rejectUrl);
  },
  validateCurrency: (currency) => {
    if (!currency || currency === '' || typeof (currency) !== 'string') {
      return false;
    }
    return /^[A-Z]{3}$/.test(currency);
  },
};
