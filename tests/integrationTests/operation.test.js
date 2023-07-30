const transactions = [
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
    userId: 'userId1',
    currency: 'USD',
    status: 'captured',
  }];

const operations = [
  {
    id: 'uuidOperation1',
    type: 'capture',
    amount: 2345.98,
    transactionId: 'uuidTransaction1',
    status: 'created',
  },
];

const action = {
  operations,
  transactions,
};
beforeEach(() => {
  // eslint-disable-next-line no-global-assign
  fetch = jest.fn().mockImplementation((url, data, status, responseBody) => Promise.resolve({
    // url : correspond à l'url de la requête
    url,
    // data : correspond au body de la requête
    data,
    // status : correspond au status de la response
    status,
    // responseBody : correspond au body de la response
    responseBody,
  }));
});

function getStatusCode(
  needParams,
  actionName,
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
    const array = actionName.filter((data) => data.id === id);
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

describe('Operation - post create operation', () => {
  it('should return a 201 status', async () => {
    const transactionId = 'uuidTransaction1';
    const statusCode = getStatusCode(true, action.transactions, transactionId, 'admin', 201, 401, 403, 422, 404, true);
    const fetched = await fetch(
      'http://localhost:1337/api/operations',
      {
        transactionId,
        amount: 0.99,
      },
      statusCode,
      {
        id: 'uuid111',
        transactionId: 2,
        amount: 2345.98,
      },
    );
    expect(fetch).toHaveBeenCalled();
    expect(fetched.status).toEqual(201);
    expect(fetched.responseBody).toEqual({
      id: 'uuid111',
      transactionId: 2,
      amount: 2345.98,
    });
  });
  it('should return a 401 status', async () => {
    const transactionId = 'uuidTransaction1';
    const statusCode = getStatusCode(true, action.transactions, transactionId, 'admin', 201, 401, 403, 422, 404, false);
    const fetched = await fetch(
      'http://localhost:1337/api/operations',
      {
        transactionId,
        amount: 0.99,
      },
      statusCode,
      {},
    );
    expect(fetch).toHaveBeenCalled();
    expect(fetched.status).toEqual(401);
    expect(fetched.responseBody).toEqual({});
  });
  it('should return a 422 status', async () => {
    const transactionId = 1;
    const statusCode = getStatusCode(true, action.transactions, transactionId, 'admin', 201, 401, 403, 422, 404, true);
    const fetched = await fetch(
      'http://localhost:1337/api/operation/create',
      {
        transactionId,
        amount: 0.99,
      },
      statusCode,
      {},
    );
    expect(fetch).toHaveBeenCalled();
    expect(fetched.status).toEqual(422);
    expect(fetched.responseBody).toEqual({});
  });
  it('should return a 404 status', async () => {
    const transactionId = 'uuid9';
    const statusCode = getStatusCode(true, action.transactions, transactionId, 'admin', 201, 401, 403, 422, 404, true);
    const fetched = await fetch(
      'http://localhost:1337/api/operation/create',
      {
        transactionId,
        amount: 0.99,
        type: 'PARTIAL',
      },
      statusCode,
      {},
    );
    expect(fetch).toHaveBeenCalled();
    expect(fetched.status).toEqual(404);
    expect(fetched.responseBody).toEqual({});
  });
});

describe('Operation - get operation by id', () => {
  it('should return a 200 status', async () => {
    const operationId = 'uuidOperation1';
    const statusCode = getStatusCode(true, action.operations, operationId, 'admin', 200, 401, 403, 422, 404, true);
    const fetched = await fetch(
      `http://localhost:1337/api/operations/${operationId}`,
      {},
      statusCode,
      // correspond au body de la response
      {
        id: 'uuidOperation1',
        transactionId: 1,
        amount: 0.99,
      },
    );
    expect(fetch).toHaveBeenCalled();
    expect(fetched.status).toEqual(200);
    expect(fetched.responseBody).toEqual({
      id: 'uuidOperation1',
      transactionId: 1,
      amount: 0.99,
    });
  });
  it('should return a 401 status', async () => {
    const operationId = 'uuidOperation1';
    const statusCode = getStatusCode(true, action.operations, operationId, 'admin', 200, 401, 403, 422, 404, false);
    const fetched = await fetch(
      `http://localhost:1337/api/operations/${operationId}`,
      {},
      statusCode,
      {},
    );
    expect(fetch).toHaveBeenCalled();
    expect(fetched.status).toEqual(401);
    expect(fetched.responseBody).toEqual({});
  });
  it('should return a 422 status', async () => {
    const operationId = 1;
    const statusCode = getStatusCode(true, action.operations, operationId, 'admin', 200, 401, 403, 422, 404, true);
    const fetched = await fetch(
      `http://localhost:1337/api/operations/${operationId}`,
      {},
      statusCode,
      {},
    );
    expect(fetch).toHaveBeenCalled();
    expect(fetched.status).toEqual(422);
    expect(fetched.responseBody).toEqual({});
  });
  it('should return a 404 status', async () => {
    const operationId = 'uuid9';
    const statusCode = getStatusCode(true, action.operations, operationId, 'admin', 200, 401, 403, 422, 404, true);
    const fetched = await fetch(
      `http://localhost:1337/api/operation/${operationId}`,
      {},
      statusCode,
      {},
    );
    expect(fetch).toHaveBeenCalled();
    expect(fetched.status).toEqual(404);
    expect(fetched.responseBody).toEqual({});
  });
});