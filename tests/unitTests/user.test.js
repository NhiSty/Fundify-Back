const UserValidator = require('../../validator/UserValidator');

describe('User email validator', () => {
  it('valid email should return true', () => {
    expect(UserValidator.validateEmail('valide@gmail.com')).toBe(true);
  });
  it('not valid email should return false', () => {
    expect(UserValidator.validateEmail('invalide@gmail')).toBe(false);
  });
  it('empty email should return false', () => {
    expect(UserValidator.validateEmail('')).toBe(false);
  });
  it('null email should return false', () => {
    expect(UserValidator.validateEmail(null)).toBe(false);
  });
  it('undefined email should return false', () => {
    expect(UserValidator.validateEmail(undefined)).toBe(false);
  });
  it('email without @ should return false', () => {
    expect(UserValidator.validateEmail('invalidegmail.com')).toBe(false);
  });
});

describe('User password validator', () => {
  it('valid pwd should return true', () => {
    expect(UserValidator.validatePassword('Test1234*')).toBe(true);
  });
  it('not valid pwd should return false', () => {
    expect(UserValidator.validatePassword('invalidepassword')).toBe(false);
  });
  it('empty pwd should return false', () => {
    expect(UserValidator.validatePassword('')).toBe(false);
  });
  it('null pwd should return false', () => {
    expect(UserValidator.validatePassword(null)).toBe(false);
  });
  it('undefined pwd should return false', () => {
    expect(UserValidator.validatePassword(undefined)).toBe(false);
  });
  it('pwd with less than 8 characters should return false', () => {
    expect(UserValidator.validatePassword('Test1*')).toBe(false);
  });
});

describe('User lastname validator', () => {
  it('valid lastname should return true', () => {
    expect(UserValidator.validateLastname('Dupont')).toBe(true);
  });
  it('empty lastname should return false', () => {
    expect(UserValidator.validateLastname('')).toBe(false);
  });
  it('null lastname should return false', () => {
    expect(UserValidator.validateLastname(null)).toBe(false);
  });
  it('undefined lastname should return false', () => {
    expect(UserValidator.validateLastname(undefined)).toBe(false);
  });
  it('number lastname should return false', () => {
    expect(UserValidator.validateLastname(1)).toBe(false);
  });
});

describe('User firstName validator', () => {
  it('valid firstname should return true', () => {
    expect(UserValidator.validateFirstname('Dupont')).toBe(true);
  });
  it('empty firstname should return false', () => {
    expect(UserValidator.validateFirstname('')).toBe(false);
  });
  it('null firstname should return false', () => {
    expect(UserValidator.validateFirstname(null)).toBe(false);
  });
  it('undefined firstname should return false', () => {
    expect(UserValidator.validateFirstname(undefined)).toBe(false);
  });
  it('number firstname should return false', () => {
    expect(UserValidator.validateFirstname(1)).toBe(false);
  });
});

describe('User isAdmin validator', () => {
  it('user is admin valid boolean should return true', () => {
    expect(UserValidator.validateIsAdmin(true)).toBe(true);
  });
  it('user is not admin valid boolean should return true', () => {
    expect(UserValidator.validateIsAdmin(false)).toBe(true);
  });
  it('empty isAdmin should return false', () => {
    expect(UserValidator.validateIsAdmin('')).toBe(false);
  });
  it('null isAdmin should return false', () => {
    expect(UserValidator.validateIsAdmin(null)).toBe(false);
  });
  it('undefined isAdmin should return false', () => {
    expect(UserValidator.validateIsAdmin(undefined)).toBe(false);
  });
});
