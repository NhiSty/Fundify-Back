const arrayOfMerchant = [
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

function getMerchantById(id, statusCodeSuccess, statusCodeUnauthorized, statusMalFormed, statusNotFound) {
  if (id === undefined || id === null || id === '' || typeof (id) !== 'number') {
    return statusMalFormed;
  }
  const array = arrayOfMerchant.filter((data) => data.id === id);
  if (array.length === 0) {
    return statusNotFound;
  }
  if (array[0].approved === false) {
    return statusCodeUnauthorized;
  }
  return statusCodeSuccess;
}

describe('Admin - Validate', () => {
  it('validate should return a 200 status', async () => {
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
  it('validate should return a 401 status', async () => {
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
  it('validate should return a 422 status', async () => {
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
  it('validate should return a 404 status', async () => {
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

describe('Admin - Invalidate', () => {
  it('invalidate should return a 200 status', async () => {
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
  it('invalidate should return a 401 status', async () => {
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
  it('invalidate should return a 422 status', async () => {
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
  it('invalidate should return a 404 status', async () => {
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
