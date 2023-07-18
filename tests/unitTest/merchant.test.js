const MerchantValidator = require('../../validator/MerchantValidator');

describe('Merchant email validator', () => {
  it('valid email should return true', () => {
    expect(MerchantValidator.validateEmail('valide@gmail.com')).toBe(true);
  });
  it('not valid email should return false', () => {
    expect(MerchantValidator.validateEmail('invalide@gmail')).toBe(false);
  });
  it('empty email should return false', () => {
    expect(MerchantValidator.validateEmail('')).toBe(false);
  });
  it('null email should return false', () => {
    expect(MerchantValidator.validateEmail(null)).toBe(false);
  });
  it('undefined email should return false', () => {
    expect(MerchantValidator.validateEmail(undefined)).toBe(false);
  });
  it('email without @ should return false', () => {
    expect(MerchantValidator.validateEmail('invalidegmail.com')).toBe(false);
  });
});

describe('Merchant password validator', () => {
  it('valid pwd should return true', () => {
    expect(MerchantValidator.validatePassword('Test1234*')).toBe(true);
  });
  it('not valid pwd should return false', () => {
    expect(MerchantValidator.validatePassword('invalidepassword')).toBe(false);
  });
  it('empty pwd should return false', () => {
    expect(MerchantValidator.validatePassword('')).toBe(false);
  });
  it('null pwd should return false', () => {
    expect(MerchantValidator.validatePassword(null)).toBe(false);
  });
  it('undefined pwd should return false', () => {
    expect(MerchantValidator.validatePassword(undefined)).toBe(false);
  });
  it('pwd with less than 8 characters should return false', () => {
    expect(MerchantValidator.validatePassword('Test1*')).toBe(false);
  });
});

describe('Merchant lastname validator', () => {
  it('valid lastname should return true', () => {
    expect(MerchantValidator.validateLastname('Dupont')).toBe(true);
  });
  it('empty lastname should return false', () => {
    expect(MerchantValidator.validateLastname('')).toBe(false);
  });
  it('null lastname should return false', () => {
    expect(MerchantValidator.validateLastname(null)).toBe(false);
  });
  it('undefined lastname should return false', () => {
    expect(MerchantValidator.validateLastname(undefined)).toBe(false);
  });
  it('number lastname should return false', () => {
    expect(MerchantValidator.validateLastname(1)).toBe(false);
  });
});

describe('Merchant firstName validator', () => {
  it('valid firstname should return true', () => {
    expect(MerchantValidator.validateFirstname('Dupont')).toBe(true);
  });
  it('empty firstname should return false', () => {
    expect(MerchantValidator.validateFirstname('')).toBe(false);
  });
  it('null firstname should return false', () => {
    expect(MerchantValidator.validateFirstname(null)).toBe(false);
  });
  it('undefined firstname should return false', () => {
    expect(MerchantValidator.validateFirstname(undefined)).toBe(false);
  });
  it('number firstname should return false', () => {
    expect(MerchantValidator.validateFirstname(1)).toBe(false);
  });
});

describe('Merchant society validator', () => {
  it('valid society should return true', () => {
    expect(MerchantValidator.validateSociety('Dupont')).toBe(true);
  });
  it('empty society should return false', () => {
    expect(MerchantValidator.validateSociety('')).toBe(false);
  });
  it('null society should return false', () => {
    expect(MerchantValidator.validateSociety(null)).toBe(false);
  });
  it('undefined society should return false', () => {
    expect(MerchantValidator.validateSociety(undefined)).toBe(false);
  });
  it('number society should return false', () => {
    expect(MerchantValidator.validateSociety(1)).toBe(false);
  });
});

describe('Merchant phone validator', () => {
  it('valid phone should return true', () => {
    expect(MerchantValidator.validatePhoneNumber('0606060606')).toBe(true);
  });
  it('empty phone should return false', () => {
    expect(MerchantValidator.validatePhoneNumber('')).toBe(false);
  });
  it('null phone should return false', () => {
    expect(MerchantValidator.validatePhoneNumber(null)).toBe(false);
  });
  it('undefined phone should return false', () => {
    expect(MerchantValidator.validatePhoneNumber(undefined)).toBe(false);
  });
  it('phone with less than 10 characters should return false', () => {
    expect(MerchantValidator.validatePhoneNumber('06060606')).toBe(false);
  });
  it('phone with more than 10 characters should return false', () => {
    expect(MerchantValidator.validatePhoneNumber('060606060606')).toBe(false);
  });
  it('phone with letters should return false', () => {
    expect(MerchantValidator.validatePhoneNumber('060606060a')).toBe(false);
  });
  it('phone with special characters should return false', () => {
    expect(MerchantValidator.validatePhoneNumber('0606060606*')).toBe(false);
  });
});

describe('Merchant confirmationURL validator', () => {
  it('valid confirmationURL should return true', () => {
    expect(MerchantValidator.validateConfirmationUrl('http://google.fr')).toBe(true);
  });
  it('empty confirmationURL should return false', () => {
    expect(MerchantValidator.validateConfirmationUrl('')).toBe(false);
  });
  it('null confirmationURL should return false', () => {
    expect(MerchantValidator.validateConfirmationUrl(null)).toBe(false);
  });
  it('undefined confirmationURL should return false', () => {
    expect(MerchantValidator.validateConfirmationUrl(undefined)).toBe(false);
  });
  it('confirmationURL without http should return false', () => {
    expect(MerchantValidator.validateConfirmationUrl('google.fr')).toBe(false);
  });
});

describe('Merchant rejectURL validator', () => {
  it('valid rejectURL should return true', () => {
    expect(MerchantValidator.validateRejectUrl('http://google.fr')).toBe(true);
  });
  it('empty rejectURL should return false', () => {
    expect(MerchantValidator.validateRejectUrl('')).toBe(false);
  });
  it('null rejectURL should return false', () => {
    expect(MerchantValidator.validateRejectUrl(null)).toBe(false);
  });
  it('undefined rejectURL should return false', () => {
    expect(MerchantValidator.validateRejectUrl(undefined)).toBe(false);
  });
  it('rejectURL without http should return false', () => {
    expect(MerchantValidator.validateRejectUrl('google.fr')).toBe(false);
  });
});

describe('Merchant currency validator', () => {
  it('valid currency should return true', () => {
    expect(MerchantValidator.validateCurrency('EUR')).toBe(true);
  });
  it('malformed currency should return false', () => {
    expect(MerchantValidator.validateCurrency('USd')).toBe(false);
  });
  it('empty currency should return false', () => {
    expect(MerchantValidator.validateCurrency('')).toBe(false);
  });
  it('null currency should return false', () => {
    expect(MerchantValidator.validateCurrency(null)).toBe(false);
  });
  it('undefined currency should return false', () => {
    expect(MerchantValidator.validateCurrency(undefined)).toBe(false);
  });
  it('incorrect currency should return false', () => {
    expect(MerchantValidator.validateCurrency('EURO')).toBe(false);
  });
});

describe('Merchant role validator', () => {
  it('valid role should return true', () => {
    expect(MerchantValidator.validateRole('MERCHANT')).toBe(true);
  });
  it('Inexistant role should return false', () => {
    expect(MerchantValidator.validateRole('Serkan')).toBe(false);
  });
  it('empty role should return false', () => {
    expect(MerchantValidator.validateRole('')).toBe(false);
  });
  it('null role should return false', () => {
    expect(MerchantValidator.validateRole(null)).toBe(false);
  });
  it('undefined role should return false', () => {
    expect(MerchantValidator.validateRole(undefined)).toBe(false);
  });
  it('number role should return false', () => {
    expect(MerchantValidator.validateRole(1)).toBe(false);
  });
  it('Incorrect role should return false', () => {
    expect(MerchantValidator.validateRole('Merchant')).toBe(false);
  });
});
