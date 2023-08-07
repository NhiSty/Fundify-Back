const arrayOfTransactions = [
  {
    id: 1,
    amount: 0.99,
    merchantId: 'uuid1',
    userId: 'userId1',
    currency: 'EUR',
    status: 'created',
  },
  {
    id: 'uuidTransaction4',
    amount: 234.56,
    merchantId: 'uuid2',
    userId: 'userId2',
    currency: 'USD',
    status: 'captured',
  }];

beforeEach(() => {
  // eslint-disable-next-line no-global-assign
  fetch = jest.fn().mockImplementation((url, data, status, responseBody) => Promise.resolve({
    url,
    data,
    status,
    responseBody,
  }));
});

function verifyTransaction(transaction) {
  if (typeof transaction.id !== 'string') {
    return 422;
  }
  if (typeof transaction.amount !== 'number') {
    return 422;
  }
  if (typeof transaction.merchantId !== 'string') {
    return 422;
  }
  if (typeof transaction.userId !== 'string') {
    return 422;
  }
  if (transaction.currency !== 'EUR' && transaction.currency !== 'USD') {
    return 422;
  }
  if (transaction.status !== 'created' && transaction.status !== 'captured') {
    return 422;
  }
  return 201;
}
function checkRole(role, loggedUser, allowedForMerchant = false) {
  if (allowedForMerchant) {
    if (!loggedUser) {
      return 401;
    }
    if (role !== 'merchant') {
      return 403;
    }
    return 200;
  }

  if (!loggedUser) {
    return 401;
  }
  if (role !== 'admin') {
    return 403;
  }
  return 200;
}

describe('Create transaction', () => {
  it('should return a 422 status', async () => {
    const statusCode = verifyTransaction(arrayOfTransactions[0]);
    const fetched = await fetch(
      'http://localhost:1337/api/transactions',
      {
        id: 1,
        amount: 0.99,
        merchantId: 'uuid1',
        userId: 'userId1',
        currency: 'EUR',
        status: 'created',
      },
      statusCode,
      {},
    );
    expect(fetch)
      .toHaveBeenCalled();
    expect(fetched.status)
      .toEqual(422);
    expect(fetched.responseBody)
      .toEqual({});
  });
  it('should return a 201 status', async () => {
    const statusCode = verifyTransaction(arrayOfTransactions[1]);
    const fetched = await fetch(
      'http://localhost:1337/api/admin/merchant/validate',
      {
        id: 'uuidTransaction4',
        amount: 234.56,
        merchantId: 'uuid2',
        userId: 'userId2',
        currency: 'USD',
        status: 'captured',
      },
      statusCode,
      {
        id: 'uuidTransaction4',
        amount: 234.56,
        merchantId: 'uuid2',
        userId: 'userId2',
        currency: 'USD',
        status: 'captured',
      },
    );
    expect(fetch)
      .toHaveBeenCalled();
    expect(fetched.status)
      .toEqual(201);
    expect(fetched.responseBody)
      .toEqual({
        id: 'uuidTransaction4',
        amount: 234.56,
        merchantId: 'uuid2',
        userId: 'userId2',
        currency: 'USD',
        status: 'captured',
      });
  });
});
describe('Get all transactions', () => {
  it('should return a 200 status', async () => {
    const statusCode = checkRole('admin', true);
    const fetched = await fetch(
      'http://localhost:1337/api/transactions',
      {},
      statusCode,
      arrayOfTransactions,
    );
    expect(fetch)
      .toHaveBeenCalled();
    expect(fetched.status)
      .toEqual(200);
    expect(fetched.responseBody)
      .toEqual(arrayOfTransactions);
  });
  it('should return a 401 status because user is not logged', async () => {
    const fetched = await fetch(
      'http://localhost:1337/api/transactions',
      {},
      401,
      {},
    );
    expect(fetch)
      .toHaveBeenCalled();
    expect(fetched.status)
      .toEqual(401);
    expect(fetched.responseBody)
      .toEqual({});
  });
  it('should return a 403 status because user is not admin', async () => {
    const statusCode = checkRole('user', true);
    const fetched = await fetch(
      'http://localhost:1337/api/transactions',
      {},
      statusCode,
      {},
    );
    expect(fetch)
      .toHaveBeenCalled();
    expect(fetched.status)
      .toEqual(403);
    expect(fetched.responseBody)
      .toEqual({});
  });
});
describe('Get transaction by id', () => {
  it('should return a 200 status', async () => {
    const statusCode = checkRole('merchant', true, true);
    const fetched = await fetch(
      'http://localhost:1337/api/transactions/uuidTransaction4',
      { },
      statusCode,
      arrayOfTransactions[1],
    );
    expect(fetch)
      .toHaveBeenCalled();
    expect(fetched.status)
      .toEqual(200);
    expect(fetched.responseBody)
      .toEqual(arrayOfTransactions[1]);
  });
  it('should return 404 status because transaction does not exist', async () => {
    const statusCode = arrayOfTransactions.find((transaction) => transaction.id === 'uuidTransaction4sdsvdvdsv') ? 200 : 404;
    const fetched = await fetch(
      'http://localhost:1337/api/transactions/uuidTransaction4sdsvdvdsv',
      { },
      statusCode,
      {},
    );
    expect(fetch)
      .toHaveBeenCalled();
    expect(fetched.status)
      .toEqual(404);
    expect(fetched.responseBody)
      .toEqual({});
  });
  it('should return a 401 status because user is not logged', async () => {
    const statusCode = checkRole('merchant', false, true);
    const fetched = await fetch(
      'http://localhost:1337/api/transactions/uuidTransaction4',
      {},
      statusCode,
      {},
    );
    expect(fetch)
      .toHaveBeenCalled();
    expect(fetched.status)
      .toEqual(401);
    expect(fetched.responseBody)
      .toEqual({});
  });
  it('should return a 403 status because user is not merchant or admin', async () => {
    const statusCode = checkRole('user', true, true);
    const fetched = await fetch(
      'http://localhost:1337/api/transactions/uuidTransaction4',
      {},
      statusCode,
      {},
    );
    expect(fetch)
      .toHaveBeenCalled();
    expect(fetched.status)
      .toEqual(403);
    expect(fetched.responseBody)
      .toEqual({});
  });
});
describe('Get merchant transactions', () => {
  it('should return a 200 status', async () => {
    const statusCode = checkRole('merchant', true, true);
    const fetched = await fetch(
      'http://localhost:1337/api/merchant/uuid2/transactions',
      {},
      statusCode,
      arrayOfTransactions,
    );
    expect(fetch)
      .toHaveBeenCalled();
    expect(fetched.status)
      .toEqual(200);
    expect(fetched.responseBody)
      .toEqual(arrayOfTransactions);
  });
  it('should return a 401 status because user is not logged', async () => {
    const statusCode = checkRole('merchant', false, true);
    const fetched = await fetch(
      'http://localhost:1337/api/merchant/uuid2/transactions',
      {},
      statusCode,
      {},
    );
    expect(fetch)
      .toHaveBeenCalled();
    expect(fetched.status)
      .toEqual(401);
    expect(fetched.responseBody)
      .toEqual({});
  });
  it('should return a 403 status because user is not merchant or admin', async () => {
    const statusCode = checkRole('user', true, true);
    const fetched = await fetch(
      'http://localhost:1337/api/merchant/uuid2/transactions',
      {},
      statusCode,
      {},
    );
    expect(fetch)
      .toHaveBeenCalled();
    expect(fetched.status)
      .toEqual(403);
    expect(fetched.responseBody)
      .toEqual({});
  });
  it('should return a 404 status because merchant does not exist', async () => {
    // eslint-disable-next-line max-len
    const statusCode = arrayOfTransactions.find((transaction) => transaction.merchantId === 'uuid2sdvsdvsd') ? 200 : 404;
    const fetched = await fetch(
      'http://localhost:1337/api/merchant/uuid2sdvsdvsd/transactions',
      {},
      statusCode,
      {},
    );
    expect(fetch)
      .toHaveBeenCalled();
    expect(fetched.status)
      .toEqual(404);
    expect(fetched.responseBody)
      .toEqual({});
  });
});
