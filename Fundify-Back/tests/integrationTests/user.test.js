const arrayOfMerchants = [
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

const arrayOfTransactions = [
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
    merchantId: 'uuid2',
    userId: 'userId2',
    currency: 'USD',
    status: 'captured',
  }];

const arrayOfOperations = [
  {
    id: 'uuidOperation1',
    type: 'capture',
    amount: 2345.98,
    transactionId: 'uuidTransaction1',
    status: 'created',
  },
  {
    id: 2,
    type: 'refund',
    amount: 2.34,
    transactionId: 'uuidTransaction4',
    status: 'done',
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

function getMerchantById(
  needParams,
  id,
  role,
  statusCodeSuccess,
  statusCodeUnauthorized,
  statusCodeForbidden,
  statusMalFormed,
  statusNotFound,
) {
  if (needParams === true) {
    if (id === undefined || id === null || id === '' || typeof (id) !== 'string') {
      return statusMalFormed;
    }
    const array = arrayOfMerchants.filter((data) => data.id === id);
    if (array.length === 0) {
      return statusNotFound;
    }
    if (array[0].approved === false) {
      return statusCodeUnauthorized;
    }
    if (role !== 'admin') {
      return statusCodeForbidden;
    }
    return statusCodeSuccess;
  }
  if (role === '') {
    return statusCodeUnauthorized;
  }
  if (role !== 'admin') {
    return statusCodeForbidden;
  }
  return statusCodeSuccess;
}

describe('Admin - get users', () => {
  it('Admin get users should return a 200 status', async () => {
    const statusCode = getMerchantById(false, 1, 'admin', 200, 401, 403, 422, 404);
    const fetched = await fetch(
      'http://localhost:1337/api/merchants',
      {
        // nothing in body request
      },
      statusCode,
      {
        arrayOfMerchants,
      },
    );
    expect(fetch)
      .toHaveBeenCalled();
    expect(fetched.status)
      .toEqual(200);
    expect(fetched.responseBody)
      .toEqual({ arrayOfMerchants });
  });
  it('Admin get users should return a 401 status', async () => {
    const statusCode = getMerchantById(false, 1, '', 200, 401, 403, 422, 404);
    const fetched = await fetch(
      'http://localhost:1337/api/merchants',
      {
        // nothing in body request
      },
      statusCode,
      {
        // nothing in body response
      },
    );
    expect(fetch)
      .toHaveBeenCalled();
    expect(fetched.status)
      .toEqual(401);
    expect(fetched.responseBody)
      .toEqual({});
  });
  it('Admin get users should return a 403 status', async () => {
    const statusCode = getMerchantById(false, 1, 'merchant', 200, 401, 403, 422, 404);
    const fetched = await fetch(
      'http://localhost:1337/api/merchants',
      {
        // nothing in body request
      },
      statusCode,
      {
        // nothing in body response
      },
    );
    expect(fetch)
      .toHaveBeenCalled();
    expect(fetched.status)
      .toEqual(403);
    expect(fetched.responseBody)
      .toEqual({});
  });
});

describe('Admin - Update Merchant', () => {
  it('should return a 200 status', async () => {
    const id = 1;
    const fetched = await fetch(
      `http://localhost:1337/api/users/${id}`,
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
      `http://localhost:1337/api/users/${id}`,
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
      `http://localhost:1337/api/users/${id}`,
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
      `http://localhost:1337/api/users/${id}`,
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

describe('Admin - Create user', () => {
  it('create admin should return a 200 status', async () => {
    const fetched = await fetch(
      'http://localhost:1337/api/auth/users',
      {
        email: 'adm@gmail.com',
        password: 'Test9876!',
        lastname: 'admin',
        firstname: 'administrator',
      },
      200,
      {
        id: 'e73b78c1-a9c3-4d99-8878-dd389ce8ebf1',
        isAdmin: true,
        email: 'adm@gmail.com',
        password: '$2b$10$sjNozrc6kNB0nUWl7hXHfuWDMOIH3zCXp6b9ih5O/gnVB/gbGZ/s.',
        lastname: 'admin',
        firstname: 'administrator',
        updatedAt: '2023-07-30T14:01:16.575Z',
        createdAt: '2023-07-30T14:01:16.575Z',
        merchantId: null,
      },
    );
    expect(fetch).toHaveBeenCalled();
    expect(fetched.status).toEqual(200);
    expect(fetched.responseBody).toEqual({
      id: 'e73b78c1-a9c3-4d99-8878-dd389ce8ebf1',
      isAdmin: true,
      email: 'adm@gmail.com',
      password: '$2b$10$sjNozrc6kNB0nUWl7hXHfuWDMOIH3zCXp6b9ih5O/gnVB/gbGZ/s.',
      lastname: 'admin',
      firstname: 'administrator',
      updatedAt: '2023-07-30T14:01:16.575Z',
      createdAt: '2023-07-30T14:01:16.575Z',
      merchantId: null,
    });
  });

  it('create admin should return a 422 status', async () => {
    const fetched = await fetch(
      'http://localhost:1337/api/auth/users',
      {
        email: 'adm@gmail.com',
        password: 'Test9876!',
        lastName: 'admin',
        firstName: 'administrator',
      },
      422,
      {
        id: 'e73b78c1-a9c3-4d99-8878-dd389ce8ebf1',
        isAdmin: true,
        email: 'adm@gmail.com',
        password: '$2b$10$sjNozrc6kNB0nUWl7hXHfuWDMOIH3zCXp6b9ih5O/gnVB/gbGZ/s.',
        lastname: 'admin',
        firstname: 'administrator',
        updatedAt: '2023-07-30T14:01:16.575Z',
        createdAt: '2023-07-30T14:01:16.575Z',
        merchantId: null,
      },
    );
    expect(fetch).toHaveBeenCalled();
    expect(fetched.status).toEqual(422);
    expect(fetched.responseBody).toEqual({
      id: 'e73b78c1-a9c3-4d99-8878-dd389ce8ebf1',
      isAdmin: true,
      email: 'adm@gmail.com',
      password: '$2b$10$sjNozrc6kNB0nUWl7hXHfuWDMOIH3zCXp6b9ih5O/gnVB/gbGZ/s.',
      lastname: 'admin',
      firstname: 'administrator',
      updatedAt: '2023-07-30T14:01:16.575Z',
      createdAt: '2023-07-30T14:01:16.575Z',
      merchantId: null,
    });
  });

  it('create merchant should return a 200 status', async () => {
    const fetched = await fetch(
      'http://localhost:1337/api/auth/users',
      {
        email: 'merchant-sncf@gmail.com',
        password: 'Test1234!',
        contactEmail: 'merchant-sncf@gmail.com',
        companyName: 'sncf',
        kbis: '3az6259237z90j0034q',
        contactPhone: '0990020304',
        currency: 'EUR',
        confirmationRedirectUrl: 'http://test/confirm',
        cancellationRedirectUrl: 'http://test/cancel',
        domain: 'sncf.com',
        lastname: 'serkan',
        firstname: 'dev',
      },
      200,
      {
        id: 'e73b78c1-a9c3-4d99-8878-dd389ce8ebf1',
        email: 'merchant-sncf@gmail.com',
        password: 'Test1234!',
        contactEmail: 'merchant-sncf@gmail.com',
        companyName: 'sncf',
        kbis: '3az6259237z90j0034q',
        contactPhone: '0990020304',
        currency: 'EUR',
        confirmationRedirectUrl: 'http://test/confirm',
        cancellationRedirectUrl: 'http://test/cancel',
        domain: 'sncf.com',
        lastname: 'serkan',
        firstname: 'dev',
      },
    );
    expect(fetch).toHaveBeenCalled();
    expect(fetched.status).toEqual(200);
    expect(fetched.responseBody).toEqual({
      id: 'e73b78c1-a9c3-4d99-8878-dd389ce8ebf1',
      email: 'merchant-sncf@gmail.com',
      password: 'Test1234!',
      contactEmail: 'merchant-sncf@gmail.com',
      companyName: 'sncf',
      kbis: '3az6259237z90j0034q',
      contactPhone: '0990020304',
      currency: 'EUR',
      confirmationRedirectUrl: 'http://test/confirm',
      cancellationRedirectUrl: 'http://test/cancel',
      domain: 'sncf.com',
      lastname: 'serkan',
      firstname: 'dev',
    });
  });
});

describe('Admin - Merchant - login', () => {
  it('Login as admin should return a 200 status', async () => {
    const fetched = await fetch(
      'http://localhost:1337/api/auth/users',
      {
        email: 'adm@gmail.com',
        password: 'Test9876!',
        lastname: 'admin',
        firstname: 'administrator',
      },
      200,
      {
      },
    );
    expect(fetch).toHaveBeenCalled();
    expect(fetched.status).toEqual(200);
    expect(fetched.responseBody).toEqual({});
  });
  it('Login admin should return a 401 status', async () => {
    const fetched = await fetch(
      'http://localhost:1337/api/auth/users',
      {
        email: 'nonexist@gmail.com',
        password: 'Test9876!',
        lastName: 'admin',
        firstName: 'administrator',
      },
      401,
      {},
    );
    expect(fetch).toHaveBeenCalled();
    expect(fetched.status).toEqual(401);
    expect(fetched.responseBody).toEqual({});
  });
});

describe('Admin - set user Admin', () => {
  it('should return a 200 status', async () => {
    const id = 'uuid1';

    const statusCode = getMerchantById(true, id, 'admin', 200, 401, 403, 422, 404);
    const fetched = await fetch(
      'http://localhost:1337/api/users',
      {
        isAdmin: true,
      },
      statusCode,
      {
        isAdmin: true,
      },
    );
    expect(fetch).toHaveBeenCalled();
    expect(fetched.status).toEqual(200);
    expect(fetched.responseBody).toEqual({ isAdmin: true });
  });
  it('should return a 403 status', async () => {
    const id = 'uuid1';
    const statusCode = getMerchantById(true, id, 'merchant', 200, 401, 403, 422, 404);
    const fetched = await fetch(
      'http://localhost:1337/api/admin/user/setAdmin',
      {
        isAdmin: true,
      },
      statusCode,
      {
      },
    );
    expect(fetch).toHaveBeenCalled();
    expect(fetched.status).toEqual(403);
    expect(fetched.responseBody).toEqual({});
  });
  it('should return a 422 status', async () => {
    const id = 1;
    const statusCode = getMerchantById(true, id, 'merchant', 200, 401, 403, 422, 404);
    const fetched = await fetch(
      'http://localhost:1337/api/users',
      {
        isAdmin: true,
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
    const id = 'uuidNonExist';
    const statusCode = getMerchantById(true, id, 'admin', 200, 401, 403, 422, 404);
    const fetched = await fetch(
      'http://localhost:1337/api/users',
      {
        isAdmin: true,
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

describe('Admin - logout', () => {
  it('should return a 200 status', async () => {
    const fetched = await fetch(
      'http://localhost:1337/api/users/logout',
      {
      },
      200,
      {
      },
    );
    expect(fetch).toHaveBeenCalled();
    expect(fetched.status).toEqual(200);
    expect(fetched.responseBody).toEqual({});
  });
});
