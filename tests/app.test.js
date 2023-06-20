const UserValidator = require('../validator/UserValidator');

describe('Test email Validator', () => {
  it('should return true', () => {
    expect(UserValidator.validateEmail('valide@gmail.com')).toBe(true);
  });
  it('should return false', () => {
    expect(UserValidator.validateEmail('invalide@gmail')).toBe(false);
  });
});

describe('Test password Validator', () => {
  it('should return true', () => {
    expect(UserValidator.validatePassword('Test1234*')).toBe(true);
  });
  it('should return false', () => {
    expect(UserValidator.validateEmail('invalidepassword')).toBe(false);
  });
});
