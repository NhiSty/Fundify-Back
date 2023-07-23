const arrayOfMerchants = [
  {
    id: 1,
    companyName: 'Sopra Steria',
    contactLastName: 'Joe',
    contactFirstName: 'Dalton',
    contactEmail: 'certified_merchant@gmail.com',
    contactPhone: '0606060606',
    currency: 'EUR',
    confirmationRedirectUrl: 'https://www.google.com',
    cancellationRedirectUrl: 'https://www.google.com',
    approved: true,
  },
  {
    id: 2,
    companyName: 'ESGI',
    contactLastName: 'Joe',
    contactFirstName: 'Dalton',
    contactEmail: 'non_confirmed_merchant@gmail.com',
    contactPhone: '0707070707',
    currency: 'USD',
    confirmationRedirectUrl: 'https://www.google.com',
    cancellationRedirectUrl: 'https://www.google.com',
    approved: false,
  }];

const arrayOfTransactions = [
  {
    id: 1,
    amount: 0.99,
    merchantId: 1,
    userId: 1,
    currency: 'EUR',
    status: 'CANCELLED',
  },
  {
    id: 5,
    amount: 234.56,
    merchantId: 1,
    userId: 2,
    currency: 'USD',
    status: 'CONFIRMED',
  }];

const arrayOfOperations = [
  {
    id: 1,
    type: 'TOTAL',
    amount: '2345.98',
    transactionId: 1,
  },
  {
    id: 2,
    type: 'PARTIAL',
    amount: '2.34',
    transactionId: 2,
  },
];

beforeEach(() => {
  // eslint-disable-next-line no-global-assign
  fetch = jest.fn().mockImplementation((url, data, status, responseBody) => Promise.resolve({
    url,
    data,
    status,
    responseBody,
  }));
});

function getMerchantById(id, statusCodeSuccess, statusCodeUnauthorized, statusMalFormed, statusNotFound) {
  if (id === undefined || id === null || id === '' || typeof (id) !== 'number') {
    return statusMalFormed;
  }
  const array = arrayOfMerchants.filter((data) => data.id === id);
  if (array.length === 0) {
    return statusNotFound;
  }
  if (array[0].approved === false) {
    return statusCodeUnauthorized;
  }
  return statusCodeSuccess;
}

describe('Admin - Validate merchant', () => {
  it('validate merchant should return a 200 status', async () => {
    const id = 1;

    const statusCode = getMerchantById(id, 200, 401, 422, 404);
    const fetched = await fetch(
      'http://localhost:1337/api/admin/merchant/validate',
      {
        id,
      },
      statusCode,
      {
        approved: true,
      },
    );
    expect(fetch)
      .toHaveBeenCalled();
    expect(fetched.status)
      .toEqual(200);
    expect(fetched.responseBody)
      .toEqual({ approved: true });
  });
  it('validate merchant should return a 401 status', async () => {
    const id = 2;
    const statusCode = getMerchantById(id, 200, 401, 422, 404);

    const fetched = await fetch(
      'http://localhost:1337/api/admin/merchant/validate',
      {
        id,
      },
      statusCode,
      {
        // nothing in body response
      },
    );
    expect(fetch).toHaveBeenCalled();
    expect(fetched.status).toEqual(401);
    expect(fetched.responseBody).toEqual({});
  });
  it('validate merchant should return a 422 status', async () => {
    const id = '2';
    const statusCode = getMerchantById(id, 200, 401, 422, 404);

    const fetched = await fetch(
      'http://localhost:1337/api/admin/merchant/validate',
      {
        id,
      },
      statusCode,
      {
        // nothing in body response
      },
    );
    expect(fetch).toHaveBeenCalled();
    expect(fetched.status).toEqual(422);
    expect(fetched.responseBody).toEqual({});
  });
  it('validate merchant should return a 404 status', async () => {
    const id = 3;
    const statusCode = getMerchantById(id, 200, 401, 422, 404);

    const fetched = await fetch(
      'http://localhost:1337/api/admin/merchant/validate',
      {
        id,
      },
      statusCode,
      {
        // nothing in body response
      },
    );
    expect(fetch).toHaveBeenCalled();
    expect(fetched.status).toEqual(404);
    expect(fetched.responseBody).toEqual({});
  });
});

describe('Admin - Invalidate merchant', () => {
  it('invalidate merchant should return a 200 status', async () => {
    const id = 1;

    const statusCode = getMerchantById(id, 200, 401, 422, 404);
    const fetched = await fetch(
      'http://localhost:1337/api/admin/merchant/invalidate',
      {
        id,
      },
      statusCode,
      {
        approved: false,
      },
    );
    expect(fetch).toHaveBeenCalled();
    expect(fetched.status).toEqual(200);
    expect(fetched.responseBody).toEqual({ approved: false });
  });
  it('invalidate merchant should return a 401 status', async () => {
    const id = 2;
    const statusCode = getMerchantById(id, 200, 401, 422, 404);

    const fetched = await fetch(
      'http://localhost:1337/api/admin/merchant/invalidate',
      {
        id,
      },
      statusCode,
      {
        // nothing in body response
      },
    );
    expect(fetch).toHaveBeenCalled();
    expect(fetched.status).toEqual(401);
    expect(fetched.responseBody).toEqual({});
  });
  it('invalidate merchant should return a 422 status', async () => {
    const id = '2';
    const statusCode = getMerchantById(id, 200, 401, 422, 404);

    const fetched = await fetch(
      'http://localhost:1337/api/admin/merchant/invalidate',
      {
        id,
      },
      statusCode,
      {
        // nothing in body response
      },
    );
    expect(fetch).toHaveBeenCalled();
    expect(fetched.status).toEqual(422);
    expect(fetched.responseBody).toEqual({});
  });
  it('invalidate merchant should return a 404 status', async () => {
    const id = 3;
    const statusCode = getMerchantById(id, 200, 401, 422, 404);

    const fetched = await fetch(
      'http://localhost:1337/api/admin/merchant/invalidate',
      {
        id,
      },
      statusCode,
      {
        // nothing in body response
      },
    );
    expect(fetch).toHaveBeenCalled();
    expect(fetched.status).toEqual(404);
    expect(fetched.responseBody).toEqual({});
  });
});

describe('Admin - set user Admin', () => {
  it('should return a 200 status', async () => {
    const id = 1;

    const statusCode = getMerchantById(id, 200, 401, 422, 404);
    const fetched = await fetch(
      'http://localhost:1337/api/admin/user/setAdmin',
      {
        userId: id,
      },
      statusCode,
      {
        // nothing in body response
      },
    );
    expect(fetch).toHaveBeenCalled();
    expect(fetched.status).toEqual(200);
    expect(fetched.responseBody).toEqual({});
  });
  it('should return a 401 status', async () => {
    const id = 2;
    const statusCode = getMerchantById(id, 200, 401, 422, 404);
    const fetched = await fetch(
      'http://localhost:1337/api/admin/user/setAdmin',
      {
        userId: id,
      },
      statusCode,
      {
        // nothing in body response
      },
    );
    expect(fetch).toHaveBeenCalled();
    expect(fetched.status).toEqual(401);
    expect(fetched.responseBody).toEqual({});
  });
  it('should return a 422 status', async () => {
    const id = '1';
    const statusCode = getMerchantById(id, 200, 401, 422, 404);
    const fetched = await fetch(
      'http://localhost:1337/api/admin/user/setAdmin',
      {
        userId: id,
      },
      statusCode,
      {
        // nothing in body response
      },
    );
    expect(fetch).toHaveBeenCalled();
    expect(fetched.status).toEqual(422);
    expect(fetched.responseBody).toEqual({});
  });
  it('should return a 404 status', async () => {
    const id = 3;
    const statusCode = getMerchantById(id, 200, 401, 422, 404);
    const fetched = await fetch(
      'http://localhost:1337/api/admin/user/setAdmin',
      {
        userId: id,
      },
      statusCode,
      {
        // nothing in body response
      },
    );
    expect(fetch).toHaveBeenCalled();
    expect(fetched.status).toEqual(404);
    expect(fetched.responseBody).toEqual({});
  });
});

describe('Admin - Update Merchant', () => {
  it('should return a 200 status', async () => {
    const id = 1;
    const fetched = await fetch(
      'http://localhost:1337/api/admin/merchant/update',
      {
        id,
        companyName: 'BMW',
      },
      200,
      {
        companyName: 'BMW',
      },
    );
    expect(fetch).toHaveBeenCalled();
    expect(fetched.status).toEqual(200);
    expect(fetched.responseBody).toEqual({ companyName: 'BMW' });
  });
  it('should return a 401 status', async () => {
    const id = 2;
    const fetched = await fetch(
      'http://localhost:1337/api/admin/merchant/update',
      {
        id,
        companyName: 'BMW',
      },
      401,
      {},
    );
    expect(fetch).toHaveBeenCalled();
    expect(fetched.status).toEqual(401);
    expect(fetched.responseBody).toEqual({});
  });
  it('should return a 422 status', async () => {
    const id = 1;
    const fetched = await fetch(
      'http://localhost:1337/api/admin/merchant/update',
      {
        id,
        companyName: 1,
      },
      422,
      {},
    );
    expect(fetch).toHaveBeenCalled();
    expect(fetched.status).toEqual(422);
    expect(fetched.responseBody).toEqual({});
  });
  it('should return a 404 status', async () => {
    const id = 3;
    const fetched = await fetch(
      'http://localhost:1337/api/admin/merchant/update',
      {
        id,
        companyName: 'BMW',
      },
      404,
      {},
    );
    expect(fetch).toHaveBeenCalled();
    expect(fetched.status).toEqual(404);
    expect(fetched.responseBody).toEqual({});
  });
});

describe('Admin - get all merchants', () => {
  it('should return a 200 status', async () => {
    const fetched = await fetch(
      'http://localhost:1337/api/admin/merchants',
      {},
      200,
      arrayOfMerchants,
    );
    expect(fetch).toHaveBeenCalled();
    expect(fetched.status).toEqual(200);
    expect(fetched.responseBody).toEqual(arrayOfMerchants);
  });
  it('should return a 401 status', async () => {
    const fetched = await fetch(
      'http://localhost:1337/api/admin/merchants',
      {},
      401,
      {},
    );
    expect(fetch).toHaveBeenCalled();
    expect(fetched.status).toEqual(401);
    expect(fetched.responseBody).toEqual({});
  });
});

describe('Admin - get all transactions', () => {
  it('should return a 200 status', async () => {
    const fetched = await fetch(
      'http://localhost:1337/api/admin/transactions',
      {},
      200,
      arrayOfTransactions,
    );
    expect(fetch).toHaveBeenCalled();
    expect(fetched.status).toEqual(200);
    expect(fetched.responseBody).toEqual(arrayOfTransactions);
  });
  it('should return a 401 status', async () => {
    const fetched = await fetch(
      'http://localhost:1337/api/admin/transactions',
      {},
      401,
      {},
    );
    expect(fetch).toHaveBeenCalled();
    expect(fetched.status).toEqual(401);
    expect(fetched.responseBody).toEqual({});
  });
});

describe('Admin - get all operation', () => {
  it('should return a 200 status', async () => {
    const fetched = await fetch(
      'http://localhost:1337/api/admin/operations',
      {},
      200,
      { arrayOfOperations },
    );
    expect(fetch).toHaveBeenCalled();
    expect(fetched.status).toEqual(200);
    expect(fetched.responseBody).toEqual({ arrayOfOperations });
  });
  it('should return a 401 status', async () => {
    const fetched = await fetch(
      'http://localhost:1337/api/admin/operations',
      {},
      401,
      {},
    );
    expect(fetch).toHaveBeenCalled();
    expect(fetched.status).toEqual(401);
    expect(fetched.responseBody).toEqual({});
  });
});
