const MerchantValidator = require('../../validator/MerchantValidator');

describe('Merchant email validator', () => {
  it('valid email should return true', () => {
    expect(MerchantValidator.validateEmail('valide@gmail.com')).toBe(true);
  });
  it('not valid email should return false', () => {
    expect(MerchantValidator.validateEmail('invalide@gmail')).toBe(false);
  });
  it('not valid email with uppercase should return false', () => {
    expect(MerchantValidator.validateEmail('Invalide@gmail.com')).toBe(false);
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
describe('Merchant kbis validator', () => {
  const kbis = Buffer.from('valid kbis');

  it('valid kbis should return true', () => {
    expect(MerchantValidator.validateKbis(kbis)).toBe(true);
  });
  it('empty kbis should return false', () => {
    expect(MerchantValidator.validateKbis('')).toBe(false);
  });
  it('null kbis should return false', () => {
    expect(MerchantValidator.validateKbis(null)).toBe(false);
  });
  it('undefined kbis should return false', () => {
    expect(MerchantValidator.validateKbis(undefined)).toBe(false);
  });
  it('number kbis should return false', () => {
    expect(MerchantValidator.validateKbis(1234)).toBe(false);
  });
  it('incorrect kbis should return false', () => {
    expect(MerchantValidator.validateKbis('invalide kbis')).toBe(false);
  });
});
describe('Merchant is approved validator', () => {
  it('Merchant is approved should return true', () => {
    expect(MerchantValidator.validateApprovation(true)).toBe(true);
  });
  it('empty value for approved should return false', () => {
    expect(MerchantValidator.validateApprovation('')).toBe(false);
  });
  it('null value for approved should return false', () => {
    expect(MerchantValidator.validateApprovation(null)).toBe(false);
  });
  it('undefined value for approved should return false', () => {
    expect(MerchantValidator.validateApprovation(undefined)).toBe(false);
  });
  it('incorrect value for approved should return false', () => {
    expect(MerchantValidator.validateApprovation('invalide data')).toBe(false);
  });
});

describe('Merchant domain validator', () => {
  it('valid domain should return true', () => {
    expect(MerchantValidator.validateDomain('scnf.com')).toBe(true);
  });
  it('empty domain should return false', () => {
    expect(MerchantValidator.validateDomain('')).toBe(false);
  });
  it('null domain should return false', () => {
    expect(MerchantValidator.validateDomain(null)).toBe(false);
  });
  it('undefined domain should return false', () => {
    expect(MerchantValidator.validateDomain(undefined)).toBe(false);
  });
  it('number domain should return false', () => {
    expect(MerchantValidator.validateDomain(1)).toBe(false);
  });
});
