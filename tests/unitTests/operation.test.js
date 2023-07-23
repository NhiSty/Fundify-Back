const OperationValidator = require('../../validator/OperationValidator');

describe('Transaction type validator', () => {
  it('valid type should return true', () => {
    expect(OperationValidator.validateType('TOTAL')).toBe(true);
    expect(OperationValidator.validateType('PARTIAL')).toBe(true);
  });
  it('empty type should return false', () => {
    expect(OperationValidator.validateType('')).toBe(false);
  });
  it('null type should return false', () => {
    expect(OperationValidator.validateType(null)).toBe(false);
  });
  it('undefined type should return false', () => {
    expect(OperationValidator.validateType(undefined)).toBe(false);
  });
  it('incorrect type should return false', () => {
    expect(OperationValidator.validateType('NOTEXIST')).toBe(false);
  });
});
describe('Transaction amount validator', () => {
  it('valid amount should return true', () => {
    expect(OperationValidator.validateAmount(123)).toBe(true);
  });
  it('valid amount with comma should return true', () => {
    expect(OperationValidator.validateAmount(123.45)).toBe(true);
  });
  it('valid amount with comma and starting with 0 should return true', () => {
    expect(OperationValidator.validateAmount(0.99)).toBe(true);
  });
  it('not valid amount (string number) should return false', () => {
    expect(OperationValidator.validateAmount('12345')).toBe(false);
  });
  it('not valid amount (string) should return false', () => {
    expect(OperationValidator.validateAmount('invalide')).toBe(false);
  });
  it('empty amount should return false', () => {
    expect(OperationValidator.validateAmount()).toBe(false);
  });
  it('null amount should return false', () => {
    expect(OperationValidator.validateAmount(null)).toBe(false);
  });
  it('undefined amount should return false', () => {
    expect(OperationValidator.validateAmount(undefined)).toBe(false);
  });
  it('not valid amount with lot of digit should return false', () => {
    expect(OperationValidator.validateAmount(0.123456789)).toBe(false);
  });
});
