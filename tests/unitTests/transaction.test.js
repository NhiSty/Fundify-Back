const TransactionValidator = require('../../validator/TransactionValidator');

describe('Transaction amount validator', () => {
  it('valid amount should return true', () => {
    expect(TransactionValidator.validateAmount(123)).toBe(true);
  });
  it('valid amount with comma should return true', () => {
    expect(TransactionValidator.validateAmount(123.45)).toBe(true);
  });
  it('valid amount with comma and starting with 0 should return true', () => {
    expect(TransactionValidator.validateAmount(0.99)).toBe(true);
  });
  it('not valid amount (string number) should return false', () => {
    expect(TransactionValidator.validateAmount('12345')).toBe(false);
  });
  it('not valid amount (string) should return false', () => {
    expect(TransactionValidator.validateAmount('invalide')).toBe(false);
  });
  it('empty amount should return false', () => {
    expect(TransactionValidator.validateAmount()).toBe(false);
  });
  it('null amount should return false', () => {
    expect(TransactionValidator.validateAmount(null)).toBe(false);
  });
  it('undefined amount should return false', () => {
    expect(TransactionValidator.validateAmount(undefined)).toBe(false);
  });
  it('not valid amount with lot of digit should return false', () => {
    expect(TransactionValidator.validateAmount(0.123456789)).toBe(false);
  });
});

describe('Transaction status validator', () => {
  it('valid status should return true', () => {
    expect(TransactionValidator.validateStatus('created')).toBe(true);
    expect(TransactionValidator.validateStatus('captured')).toBe(true);
    expect(TransactionValidator.validateStatus('waiting_refund')).toBe(true);
    expect(TransactionValidator.validateStatus('partial_refunded')).toBe(true);
    expect(TransactionValidator.validateStatus('refunded')).toBe(true);
    expect(TransactionValidator.validateStatus('cancelled')).toBe(true);
  });
  it('empty status should return false', () => {
    expect(TransactionValidator.validateStatus('')).toBe(false);
  });
  it('null status should return false', () => {
    expect(TransactionValidator.validateStatus(null)).toBe(false);
  });
  it('undefined status should return false', () => {
    expect(TransactionValidator.validateStatus(undefined)).toBe(false);
  });
  it('incorrect status should return false', () => {
    expect(TransactionValidator.validateStatus('NOTEXIST')).toBe(false);
  });
});

describe('Transaction currency validator', () => {
  it('valid currency should return true', () => {
    expect(TransactionValidator.validateCurrency('USD')).toBe(true);
  });
  it('malformed currency should return false', () => {
    expect(TransactionValidator.validateCurrency('euR')).toBe(false);
  });
  it('empty currency should return false', () => {
    expect(TransactionValidator.validateCurrency('')).toBe(false);
  });
  it('null currency should return false', () => {
    expect(TransactionValidator.validateCurrency(null)).toBe(false);
  });
  it('undefined currency should return false', () => {
    expect(TransactionValidator.validateCurrency(undefined)).toBe(false);
  });
  it('incorrect currency should return false', () => {
    expect(TransactionValidator.validateCurrency('EURO')).toBe(false);
  });
});
