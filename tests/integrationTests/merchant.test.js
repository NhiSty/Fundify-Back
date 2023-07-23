/*
  Les tests concernants Login / Logout / Signup sont deja effectué dans user.test.js, il est donc inutile de retester.
*/

const transactionsByMerchant = [
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
    currency: 'EUR',
    status: 'CONFIRMED',
  }];

const merchants = [
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

beforeEach(() => {
  // eslint-disable-next-line no-global-assign
  fetch = jest.fn().mockImplementation((url, data, status, responseBody) => Promise.resolve({
    url,
    data,
    status,
    responseBody,
  }));
});

function getStatusCodeByMerchantId(
  id,
  statusCodeSuccess,
  statusCodeUnauthorized,
  statusMalFormed,
  statusNotFound,
  isLogged,
) {
  if (id === undefined || id === null || id === '' || typeof (id) !== 'number') {
    return statusMalFormed;
  }
  const array = merchants.filter((data) => data.id === id);
  if (array.length === 0) {
    return statusNotFound;
  }
  if (!isLogged) {
    return statusCodeUnauthorized;
  }
  return statusCodeSuccess;
}
describe('Merchant - get merchant transactions', () => {
  it('should return a 200 status', async () => {
    const id = 1;
    const statusCode = getStatusCodeByMerchantId(id, 200, 401, 422, 404, true);
    const fetched = await fetch(
      `http://localhost:1337/api/merchant/${id}/transactions`,
      {},
      statusCode,
      transactionsByMerchant,
    );
    expect(fetch).toHaveBeenCalled();
    expect(fetched.status).toEqual(200);
    expect(fetched.responseBody).toEqual(transactionsByMerchant);
  });
  it('should return a 401 status', async () => {
    const id = 1;
    const statusCode = getStatusCodeByMerchantId(id, 200, 401, 422, 404, false);
    const fetched = await fetch(
      `http://localhost:1337/api/merchant/${id}/transactions`,
      {},
      statusCode,
      {},
    );
    expect(fetch).toHaveBeenCalled();
    expect(fetched.status).toEqual(401);
    expect(fetched.responseBody).toEqual({});
  });
  it('should return a 422 status', async () => {
    const id = '1';
    const statusCode = getStatusCodeByMerchantId(id, 200, 401, 422, 404, true);
    const fetched = await fetch(
      `http://localhost:1337/api/merchant/${id}/transactions`,
      {},
      statusCode,
      {},
    );
    expect(fetch).toHaveBeenCalled();
    expect(fetched.status).toEqual(422);
    expect(fetched.responseBody).toEqual({});
  });
  it('should return a 404 status', async () => {
    const id = 4;
    const statusCode = getStatusCodeByMerchantId(id, 200, 401, 422, 404, true);
    const fetched = await fetch(
      `http://localhost:1337/api/merchant/${id}/transactions`,
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
    const id = 1;
    let merchantData;
    const statusCode = getStatusCodeByMerchantId(id, 200, 401, 422, 404, true);
    if (statusCode !== 200) {
      merchantData = merchants.filter((data) => data.id === id);
    } else {
      merchantData = {};
    }
    const fetched = await fetch(
      `http://localhost:1337/api/merchant/${id}/account`,
      {},
      statusCode,
      merchantData,
    );
    expect(fetch).toHaveBeenCalled();
    expect(fetched.status).toEqual(200);
    expect(fetched.responseBody).toEqual(merchantData);
  });
  it('should return a 401 status', async () => {
    const id = 1;
    const statusCode = getStatusCodeByMerchantId(id, 200, 401, 422, 404, false);
    const fetched = await fetch(
      `http://localhost:1337/api/merchant/${id}/account`,
      {},
      statusCode,
      {},
    );
    expect(fetch).toHaveBeenCalled();
    expect(fetched.status).toEqual(401);
    expect(fetched.responseBody).toEqual({});
  });
  it('should return a 422 status', async () => {
    const id = '1';
    const statusCode = getStatusCodeByMerchantId(id, 200, 401, 422, 404, true);
    const fetched = await fetch(
      `http://localhost:1337/api/merchant/${id}/account`,
      {},
      statusCode,
      {},
    );
    expect(fetch).toHaveBeenCalled();
    expect(fetched.status).toEqual(422);
    expect(fetched.responseBody).toEqual({});
  });
  it('should return a 404 status', async () => {
    const id = 4;
    const statusCode = getStatusCodeByMerchantId(id, 200, 401, 422, 404, true);
    const fetched = await fetch(
      `http://localhost:1337/api/merchant/${id}/account`,
      {},
      statusCode,
      {},
    );
    expect(fetch).toHaveBeenCalled();
    expect(fetched.status).toEqual(404);
    expect(fetched.responseBody).toEqual({});
  });
});
