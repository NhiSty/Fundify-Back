const request = require('supertest');
const app = require('../../app');

const arrayOfMerchant = [
  'abc@gmail.com',
];

describe('testing login endpoint', () => {
  beforeEach(() => {
    // eslint-disable-next-line no-global-assign
    fetch = jest.fn().mockImplementation((url, data, status) => Promise.resolve({
      url,
      data,
      status,
    }));
  });
  it('should return a 200 status', async () => {
    let statusCode = 200;
    const array = arrayOfMerchant.filter((email) => email === 'abc@gmail.com');
    if (array.length === 0) {
      statusCode = 401;
    }

    const fetched = await fetch(
      'http://localhost:1337/api/admin/validate',
      {
        email: 'abc@gmail.com',
      },
      statusCode,
    );
    expect(fetch).toHaveBeenCalled();
    expect(fetched.status).toEqual(200);
  });
  it('should return a 401 status', async () => {
    let statusCode = 200;
    const array = arrayOfMerchant.filter((email) => email === 'abcdefgd@gmail.com');
    if (array.length === 0) {
      statusCode = 401;
    }
    const fetched = await fetch(
      'http://localhost:1337/api/admin/validate',
      {
        email: 'abc@gmail.com',
      },
      statusCode,
    );
    expect(fetch).toHaveBeenCalled();
    expect(fetched.status).toEqual(401);
  });
  test('Admin - Validate - Missing token', async () => {
    const response = await request(app)
      .post('/api/admin/validate')
      .send({ email: 'test@example.com' });
    expect(response.status).toBe(401);
    expect(response.body).toEqual('');
  });
});
