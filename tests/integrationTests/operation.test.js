const transactions = [
  {
    id: 1,
    amount: 0.99,
    merchantId: 1,
    userId: 1,
    currency: 'EUR',
    status: 'CANCELLED',
  },
  {
    id: 2,
    amount: 1.99,
    merchantId: 1,
    userId: 1,
    currency: 'USD',
    status: 'CONFIRMED',
  }];
const operations = [
  {
    id: 1,
    type: 'PARTIAL',
    amount: 2345.98,
    transactionId: 2,
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

function getStatusCodeByActionId(
  actionName,
  id,
  statusCodeSuccess,
  statusCodeUnauthorized,
  statusMalFormed,
  statusNotFound,
  isAuthorized,
) {
  if (id === undefined || id === null || id === '' || typeof (id) !== 'number') {
    return statusMalFormed;
  }
  const array = actionName.filter((data) => data.id === id);
  if (array.length === 0) {
    return statusNotFound;
  }
  if (!isAuthorized) {
    return statusCodeUnauthorized;
  }
  return statusCodeSuccess;
}
describe('Operation - post create operation', () => {
  it('should return a 201 status', async () => {
    const transactionId = 1;
    const statusCode = getStatusCodeByActionId(action.transactions, transactionId, 201, 401, 422, 404, true);
    const fetched = await fetch(
      'http://localhost:1337/api/operation/create',
      {
        transactionId,
        amount: 0.99,
        type: 'PARTIAL',
      },
      statusCode,
      {
        id: 4,
        transactionId: 2,
        amount: 2345.98,
        type: 'PARTIAL',
      },
    );
    expect(fetch).toHaveBeenCalled();
    expect(fetched.status).toEqual(201);
    expect(fetched.responseBody).toEqual({
      id: 4,
      transactionId: 2,
      amount: 2345.98,
      type: 'PARTIAL',
    });
  });
  it('should return a 401 status', async () => {
    const transactionId = 1;
    const statusCode = getStatusCodeByActionId(action.transactions, transactionId, 200, 401, 422, 404, false);
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
    expect(fetched.status).toEqual(401);
    expect(fetched.responseBody).toEqual({});
  });
  it('should return a 422 status', async () => {
    const transactionId = '1';
    const statusCode = getStatusCodeByActionId(action.transactions, transactionId, 200, 401, 422, 404, true);
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
    expect(fetched.status).toEqual(422);
    expect(fetched.responseBody).toEqual({});
  });
  it('should return a 404 status', async () => {
    const transactionId = 4;
    const statusCode = getStatusCodeByActionId(action.transactions, transactionId, 200, 401, 422, 404, true);
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
    const operationId = 1;
    const statusCode = getStatusCodeByActionId(action.operations, operationId, 200, 401, 422, 404, true);
    const fetched = await fetch(
      `http://localhost:1337/api/operation/${operationId}`,
      {},
      statusCode,
      // correspond au body de la response
      {
        id: 1,
        transactionId: 1,
        amount: 0.99,
        type: 'PARTIAL',
      },
    );
    expect(fetch).toHaveBeenCalled();
    expect(fetched.status).toEqual(200);
    expect(fetched.responseBody).toEqual({
      id: 1,
      transactionId: 1,
      amount: 0.99,
      type: 'PARTIAL',
    });
  });
  it('should return a 401 status', async () => {
    const operationId = 1;
    const statusCode = getStatusCodeByActionId(action.operations, operationId, 200, 401, 422, 404, false);
    const fetched = await fetch(
      `http://localhost:1337/api/operation/${operationId}`,
      {},
      statusCode,
      {},
    );
    expect(fetch).toHaveBeenCalled();
    expect(fetched.status).toEqual(401);
    expect(fetched.responseBody).toEqual({});
  });
  it('should return a 422 status', async () => {
    const operationId = '1';
    const statusCode = getStatusCodeByActionId(action.operations, operationId, 200, 401, 422, 404, true);
    const fetched = await fetch(
      `http://localhost:1337/api/operation/${operationId}`,
      {},
      statusCode,
      {},
    );
    expect(fetch).toHaveBeenCalled();
    expect(fetched.status).toEqual(422);
    expect(fetched.responseBody).toEqual({});
  });
  it('should return a 404 status', async () => {
    const operationId = 4;
    const statusCode = getStatusCodeByActionId(action.operations, operationId, 200, 401, 422, 404, true);
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

describe('Operation - get operations by transaction id', () => {
  it('should return a 200 status', async () => {
    const transactionId = 2;
    const statusCode = getStatusCodeByActionId(action.transactions, transactionId, 200, 401, 422, 404, true);
    const fetched = await fetch(
      `http://localhost:1337/api/operations/transaction/${transactionId}`,
      {},
      statusCode,
      [
        {
          id: 2,
          amount: 1.99,
          merchantId: 1,
          userId: 1,
          currency: 'USD',
          status: 'CONFIRMED',
        },
      ],
    );
    expect(fetch).toHaveBeenCalled();
    expect(fetched.status).toEqual(200);
    expect(fetched.responseBody).toEqual([
      {
        id: 2,
        amount: 1.99,
        merchantId: 1,
        userId: 1,
        currency: 'USD',
        status: 'CONFIRMED',
      },
    ]);
  });
  it('should return a 401 status', async () => {
    const transactionId = 2;
    const statusCode = getStatusCodeByActionId(action.transactions, transactionId, 200, 401, 422, 404, false);
    const fetched = await fetch(
      `http://localhost:1337/api/operations/transaction/${transactionId}`,
      {},
      statusCode,
      {},
    );
    expect(fetch).toHaveBeenCalled();
    expect(fetched.status).toEqual(401);
    expect(fetched.responseBody).toEqual({});
  });
  it('should return a 422 status', async () => {
    const transactionId = '';
    const statusCode = getStatusCodeByActionId(action.transactions, transactionId, 200, 401, 422, 404, true);
    const fetched = await fetch(
      `http://localhost:1337/api/operations/transaction/${transactionId}`,
      {},
      statusCode,
      {},
    );
    expect(fetch).toHaveBeenCalled();
    expect(fetched.status).toEqual(422);
    expect(fetched.responseBody).toEqual({});
  });
  it('should return a 404 status', async () => {
    const transactionId = 4;
    const statusCode = getStatusCodeByActionId(action.transactions, transactionId, 200, 401, 422, 404, true);
    const fetched = await fetch(
      `http://localhost:1337/api/operations/transaction/${transactionId}`,
      {},
      statusCode,
      {},
    );
    expect(fetch).toHaveBeenCalled();
    expect(fetched.status).toEqual(404);
    expect(fetched.responseBody).toEqual({});
  });
});

describe('Operation - put update operation', () => {
  it('should return a 200 status', async () => {
    const operationId = 1;
    const statusCode = getStatusCodeByActionId(action.operations, operationId, 200, 401, 422, 404, true);
    const fetched = await fetch(
      'http://localhost:1337/api/operation/update',
      {
        id: operationId,
        type: 'TOTAL',
        amount: 2345.98,
      },
      statusCode,
      {
        id: operationId,
        type: 'TOTAL',
        amount: 2345.98,
        transactionId: 1,
      },
    );
    expect(fetch).toHaveBeenCalled();
    expect(fetched.status).toEqual(200);
    expect(fetched.responseBody).toEqual({
      id: operationId,
      type: 'TOTAL',
      amount: 2345.98,
      transactionId: 1,
    });
  });
  it('should return a 401 status', async () => {
    const operationId = 1;
    const statusCode = getStatusCodeByActionId(action.operations, operationId, 200, 401, 422, 404, false);
    const fetched = await fetch(
      'http://localhost:1337/api/operation/update',
      {
        id: operationId,
        type: 'TOTAL',
        amount: 2345.98,
      },
      statusCode,
      {},
    );
    expect(fetch).toHaveBeenCalled();
    expect(fetched.status).toEqual(401);
    expect(fetched.responseBody).toEqual({});
  });
  it('should return a 422 status', async () => {
    const operationId = '1';
    const statusCode = getStatusCodeByActionId(action.operations, operationId, 200, 401, 422, 404, true);
    const fetched = await fetch(
      'http://localhost:1337/api/operation/update',
      {
        id: operationId,
        type: 'TOTAL',
        amount: 2345.98,
      },
      statusCode,
      {},
    );
    expect(fetch).toHaveBeenCalled();
    expect(fetched.status).toEqual(422);
    expect(fetched.responseBody).toEqual({});
  });
  it('should return a 404 status', async () => {
    const operationId = 4;
    const statusCode = getStatusCodeByActionId(action.operations, operationId, 200, 401, 422, 404, true);
    const fetched = await fetch(
      'http://localhost:1337/api/operation/update',
      {
        id: operationId,
        type: 'TOTAL',
        amount: 2345.98,
      },
      statusCode,
      {},
    );
    expect(fetch).toHaveBeenCalled();
    expect(fetched.status).toEqual(404);
    expect(fetched.responseBody).toEqual({});
  });
});

describe('Operation - delete operation', () => {
  it('should return a 204 status', async () => {
    const operationId = 1;
    const statusCode = getStatusCodeByActionId(action.operations, operationId, 204, 401, 422, 404, true);
    const fetched = await fetch(
      `http://localhost:1337/api/operation/${operationId}`,
      {},
      statusCode,
      {},
    );
    expect(fetch).toHaveBeenCalled();
    expect(fetched.status).toEqual(204);
    expect(fetched.responseBody).toEqual({});
  });
  it('should return a 401 status', async () => {
    const operationId = 1;
    const statusCode = getStatusCodeByActionId(action.operations, operationId, 204, 401, 422, 404, false);
    const fetched = await fetch(
      `http://localhost:1337/api/operation/${operationId}`,
      {},
      statusCode,
      {},
    );
    expect(fetch).toHaveBeenCalled();
    expect(fetched.status).toEqual(401);
    expect(fetched.responseBody).toEqual({});
  });
  it('should return a 422 status', async () => {
    const operationId = '1';
    const statusCode = getStatusCodeByActionId(action.operations, operationId, 204, 401, 422, 404, true);
    const fetched = await fetch(
      `http://localhost:1337/api/operation/${operationId}`,
      {},
      statusCode,
      {},
    );
    expect(fetch).toHaveBeenCalled();
    expect(fetched.status).toEqual(422);
    expect(fetched.responseBody).toEqual({});
  });
  it('should return a 404 status', async () => {
    const operationId = 4;
    const statusCode = getStatusCodeByActionId(action.operations, operationId, 204, 401, 422, 404, true);
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
