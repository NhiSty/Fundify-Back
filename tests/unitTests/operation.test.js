const OperationValidator = require('../../validator/OperationValidator');
const TransactionMDb = require('../../mongoDb/models/Transaction');

describe('Operation type validator', () => {
  it('valid type should return true', () => {
    expect(OperationValidator.validateType('capture')).toBe(true);
    expect(OperationValidator.validateType('refund')).toBe(true);
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

jest.mock('../../mongoDb/models/Transaction', () => ({
  findOne: jest.fn(() => ({
    refundAmountAvailable: 100,
  })),
}));
describe('Operation amount validator', () => {
  beforeEach(() => {
    TransactionMDb.findOne.mockResolvedValueOnce({
      transactionId: 'uuid',
      refundAmountAvailable: 100,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('valid amount should return true', async () => {
    const amount = 50;
    const transactionId = 'uuid';

    const result = await OperationValidator.validateAmount(amount, transactionId);
    expect(result).toBe(true);
  });

  it('valid amount with coma should return true', async () => {
    const amount = 50.50;
    const transactionId = 'uuid';

    const result = await OperationValidator.validateAmount(amount, transactionId);
    expect(result).toBe(true);
  });

  it('valid amount with comma and starting with 0 should return true', async () => {
    const amount = 0.50;
    const transactionId = 'uuid';

    const result = await OperationValidator.validateAmount(amount, transactionId);
    expect(result).toBe(true);
  });

  it('refundAmountAvailable lower than amount should return true', async () => {
    const amount = 50;
    const transactionId = 'uuid';

    const result = await OperationValidator.validateAmount(amount, transactionId);
    expect(result).toBe(true);
  });

  it('refundAmountAvailable greater than amount should return false', async () => {
    const amount = 200;
    const transactionId = 'uuid';

    const result = await OperationValidator.validateAmount(amount, transactionId);
    expect(result).toBe(false);
  });

  it('not valid amount (string number) should return false', async () => {
    const amount = '0.50';
    const transactionId = 'uuid';

    const result = await OperationValidator.validateAmount(amount, transactionId);
    expect(result).toBe(false);
  });

  it('not valid amount (string) should return false', async () => {
    const amount = 'invalide';
    const transactionId = 'uuid';

    const result = await OperationValidator.validateAmount(amount, transactionId);
    expect(result).toBe(false);
  });

  it('null amount should return false', async () => {
    const amount = null;
    const transactionId = 'uuid';

    const result = await OperationValidator.validateAmount(amount, transactionId);
    expect(result).toBe(false);
  });

  it('null amount should return false', async () => {
    const amount = undefined;
    const transactionId = 'uuid';

    const result = await OperationValidator.validateAmount(amount, transactionId);
    expect(result).toBe(false);
  });

  it('not valid amount with lot of digit should return false', async () => {
    const amount = 0.123456789;
    const transactionId = 'uuid';

    const result = await OperationValidator.validateAmount(amount, transactionId);
    expect(result).toBe(false);
  });
});

describe('Operation status validator', () => {
  it('valid type should return true', () => {
    expect(OperationValidator.validateStatus('created')).toBe(true);
    expect(OperationValidator.validateStatus('processing')).toBe(true);
    expect(OperationValidator.validateStatus('done')).toBe(true);
    expect(OperationValidator.validateStatus('failed')).toBe(true);
  });
  it('empty type should return false', () => {
    expect(OperationValidator.validateStatus('')).toBe(false);
  });
  it('null type should return false', () => {
    expect(OperationValidator.validateStatus(null)).toBe(false);
  });
  it('undefined type should return false', () => {
    expect(OperationValidator.validateStatus(undefined)).toBe(false);
  });
  it('incorrect type should return false', () => {
    expect(OperationValidator.validateStatus('NOTEXIST')).toBe(false);
  });
});
