const merchants = [
  {
    id: 'uuid1',
    companyName: 'Sopra Steria',
    kbis: 'kbis',
    contactLastName: 'Joe',
    contactFirstName: 'Dalton',
    contactEmail: 'certified_merchant@gmail.com',
    contactPhone: '0606060606',
    currency: 'EUR',
    domain: 'sncf.drive.fr',
    confirmationRedirectUrl: 'https://www.google.com',
    cancellationRedirectUrl: 'https://www.google.com',
    approved: true,
    credentialsIs: 1,
  },
  {
    id: 'uuid2',
    companyName: 'ESGI',
    kbis: 'kbis2',
    contactLastName: 'Joe',
    contactFirstName: 'Dalton',
    contactEmail: 'non_confirmed_merchant@gmail.com',
    contactPhone: '0707070707',
    currency: 'USD',
    domain: 'automator.fr',
    confirmationRedirectUrl: 'https://www.google.com',
    cancellationRedirectUrl: 'https://www.google.com',
    approved: false,
    credentialsIs: 2,
  }];

const transactionsByMerchant = [
  {
    id: 'uuidTransaction1',
    amount: 0.99,
    merchantId: 'uuid1',
    userId: 'userId1',
    currency: 'EUR',
    status: 'created',
  },
  {
    id: 'uuidTransaction4',
    amount: 234.56,
    merchantId: 'uuid1',
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

function getStatusCode(
  needParams,
  id,
  role,
  statusCodeSuccess,
  statusCodeUnauthorized,
  statusForbidden,
  statusMalFormed,
  statusNotFound,
  isLogged,
) {
  if (needParams === true) {
    if (id === undefined || id === null || id === '' || typeof (id) !== 'string') {
      return statusMalFormed;
    }
    const array = merchants.filter((data) => data.id === id);
    if (array.length === 0) {
      return statusNotFound;
    }
    if (!isLogged) {
      return statusCodeUnauthorized;
    }
    if (role !== 'admin') {
      return statusForbidden;
    }
    return statusCodeSuccess;
  }
  if (!isLogged) {
    return statusCodeUnauthorized;
  }
  if (role !== 'admin') {
    return statusForbidden;
  }
  return statusCodeSuccess;
}

describe('Admin - get all merchants ', () => {
  it('should return a 200 status', async () => {
    const statusCode = getStatusCode(false, 1, 'admin', 200, 401, 403, 422, 404, true);
    const fetched = await fetch(
      'http://localhost:1337/api/merchants',
      {},
      statusCode,
      merchants,
    );
    expect(fetch).toHaveBeenCalled();
    expect(fetched.status).toEqual(200);
    expect(fetched.responseBody).toEqual(merchants);
  });
  it('should return a 401 status', async () => {
    const statusCode = getStatusCode(false, 1, 'admin', 200, 401, 403, 422, 404, false);
    const fetched = await fetch(
      'http://localhost:1337/api/merchants',
      {},
      statusCode,
      {},
    );
    expect(fetch).toHaveBeenCalled();
    expect(fetched.status).toEqual(401);
    expect(fetched.responseBody).toEqual({});
  });
  it('should return a 403 status', async () => {
    const statusCode = getStatusCode(false, 1, 'merchant', 200, 401, 403, 422, 404, true);
    const fetched = await fetch(
      'http://localhost:1337/api/merchants',
      {},
      statusCode,
      {},
    );
    expect(fetch).toHaveBeenCalled();
    expect(fetched.status).toEqual(403);
    expect(fetched.responseBody).toEqual({});
  });
});

describe('Merchant - get merchant transactions', () => {
  it('should return a 200 status', async () => {
    const id = 'uuid1';
    const statusCode = getStatusCode(true, id, 'admin', 200, 401, 403, 422, 404, true);
    const fetched = await fetch(
      `http://localhost:1337/api/merchants/${id}/transactions`,
      {},
      statusCode,
      transactionsByMerchant,
    );
    expect(fetch).toHaveBeenCalled();
    expect(fetched.status).toEqual(200);
    expect(fetched.responseBody).toEqual(transactionsByMerchant);
  });
  it('should return a 401 status', async () => {
    const id = 'uuid1';
    const statusCode = getStatusCode(true, id, '', 200, 401, 403, 422, 404, false);
    const fetched = await fetch(
      `http://localhost:1337/api/merchants/${id}/transactions`,
      {},
      statusCode,
      {},
    );
    expect(fetch).toHaveBeenCalled();
    expect(fetched.status).toEqual(401);
    expect(fetched.responseBody).toEqual({});
  });
  it('should return a 422 status', async () => {
    const id = 1;
    const statusCode = getStatusCode(true, id, 'admin', 200, 401, 403, 422, 404, true);
    const fetched = await fetch(
      `http://localhost:1337/api/merchants/${id}/transactions`,
      {},
      statusCode,
      {},
    );
    expect(fetch).toHaveBeenCalled();
    expect(fetched.status).toEqual(422);
    expect(fetched.responseBody).toEqual({});
  });
  it('should return a 404 status', async () => {
    const id = 'uuid10';
    const statusCode = getStatusCode(true, id, 'admin', 200, 401, 403, 422, 404, true);
    const fetched = await fetch(
      `http://localhost:1337/api/merchants/${id}/transactions`,
      {},
      statusCode,
      {},
    );
    expect(fetch).toHaveBeenCalled();
    expect(fetched.status).toEqual(404);
    expect(fetched.responseBody).toEqual({});
  });
});

describe('Merchant - get merchant account', () => {
  it('should return a 200 status', async () => {
    const id = 'uuid1';
    let merchantData;
    const statusCode = getStatusCode(true, id, 'admin', 200, 401, 403, 422, 404, true);
    if (statusCode !== 200) {
      merchantData = merchants.filter((data) => data.id === id);
    } else {
      merchantData = {};
    }
    const fetched = await fetch(
      `http://localhost:1337/api/merchants/${id}`,
      {},
      statusCode,
      merchantData,
    );
    expect(fetch).toHaveBeenCalled();
    expect(fetched.status).toEqual(200);
    expect(fetched.responseBody).toEqual(merchantData);
  });
  it('should return a 401 status', async () => {
    const id = 'uuid1';
    const statusCode = getStatusCode(true, id, 'admin', 200, 401, 403, 422, 404, false);
    const fetched = await fetch(
      `http://localhost:1337/api/merchants/${id}`,
      {},
      statusCode,
      {},
    );
    expect(fetch).toHaveBeenCalled();
    expect(fetched.status).toEqual(401);
    expect(fetched.responseBody).toEqual({});
  });
  it('should return a 422 status', async () => {
    const id = 1;
    const statusCode = getStatusCode(true, id, 'admin', 200, 401, 403, 422, 404, true);
    const fetched = await fetch(
      `http://localhost:1337/api/merchants/${id}`,
      {},
      statusCode,
      {},
    );
    expect(fetch).toHaveBeenCalled();
    expect(fetched.status).toEqual(422);
    expect(fetched.responseBody).toEqual({});
  });
  it('should return a 404 status', async () => {
    const id = 'uuid100';
    const statusCode = getStatusCode(true, id, 'admin', 200, 401, 403, 422, 404, true);
    const fetched = await fetch(
      `http://localhost:1337/api/merchants/${id}`,
      {},
      statusCode,
      {},
    );
    expect(fetch).toHaveBeenCalled();
    expect(fetched.status).toEqual(404);
    expect(fetched.responseBody).toEqual({});
  });
});

describe('Admin - validate invalidate merchant', () => {
  it('validate should return a 200 status', async () => {
    const id = 'uuid2';
    const statusCode = getStatusCode(true, id, 'admin', 200, 401, 403, 422, 404, true);

    const fetched = await fetch(
      `http://localhost:1337/api/merchants/${id}`,
      {
        approved: true,
      },
      statusCode,
      {
        approved: true,
      },
    );
    expect(fetch).toHaveBeenCalled();
    expect(fetched.status).toEqual(200);
    expect(fetched.responseBody).toEqual({ approved: true });
  });
  it('validate should return a 401 status', async () => {
    const id = 'uuid2';
    const statusCode = getStatusCode(true, id, 'admin', 200, 401, 403, 422, 404, false);

    const fetched = await fetch(
      `http://localhost:1337/api/merchants/${id}`,
      {
        approved: true,
      },
      statusCode,
      {
        // nothing
      },
    );
    expect(fetch).toHaveBeenCalled();
    expect(fetched.status).toEqual(401);
    expect(fetched.responseBody).toEqual({});
  });
  it('invalidate should return a 422 status', async () => {
    const id = 1;
    const statusCode = getStatusCode(true, id, 'admin', 200, 401, 403, 422, 404, true);
    const fetched = await fetch(
      `http://localhost:1337/api/merchants/${id}`,
      {},
      statusCode,
      {},
    );
    expect(fetch).toHaveBeenCalled();
    expect(fetched.status).toEqual(422);
    expect(fetched.responseBody).toEqual({});
  });
  it('invalidate should return a 404 status', async () => {
    const id = 'uuid100';
    const statusCode = getStatusCode(true, id, 'admin', 200, 401, 403, 422, 404, true);
    const fetched = await fetch(
      `http://localhost:1337/api/merchants/${id}`,
      {},
      statusCode,
      {},
    );
    expect(fetch).toHaveBeenCalled();
    expect(fetched.status).toEqual(404);
    expect(fetched.responseBody).toEqual({});
  });
});
