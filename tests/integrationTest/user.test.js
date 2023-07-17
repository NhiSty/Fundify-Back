const request = require('supertest');
const app = require('../../app');
const { User } = require('../../db/index');

describe('User API Tests -- Signup', () => {
  beforeEach(() => {
    jest.spyOn(User, 'create').mockImplementation((userData) => {
      if (userData.email === 'sdev@gmail.com') {
        return Promise.resolve({
          id: 1,
          firstname: 'Serkan',
          lastname: 'Deveci',
          email: 'sdev@gmail.com',
          role: 'USER',
        });
      }
      return Promise.reject(new Error('Email already used'));
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('Signup - Successful', async () => {
    const response = await request(app)
      .post('/api/auth/signup')
      .send({
        email: 'sdev@gmail.com',
        password: 'Test1234',
        lastname: 'Deveci',
        firstname: 'Serkan',
      });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      data: {
        email: 'sdev@gmail.com',
      },
    });
  });

  test('Signup - Invalid Data', async () => {
    const response = await request(app)
      .post('/api/auth/signup')
      .send({
        email: 'invalidemail',
        password: 'Test1234',
        lastname: 'Deveci',
        firstname: 'Serkan',
      });

    expect(response.status).toBe(422);
    expect(response.body).toEqual('');
  });

  test('Signup - Email Already Used', async () => {
    jest.spyOn(User, 'create').mockRejectedValueOnce(new Error('Email already used'));

    const response = await request(app)
      .post('/api/auth/signup')
      .send({
        email: 'sdev@gmail.com',
        password: 'Test1234',
        lastname: 'Deveci',
        firstname: 'Serkan',
      });

    expect(response.status).toBe(409);
    expect(response.body).toEqual({ message: 'Email already used' });
  });
});
describe('User API Tests -- Login', () => {
  beforeEach(() => {
    jest.spyOn(User, 'findOne').mockImplementation(async (options) => {
      const { where } = options;
      if (where.email === 'sdev@gmail.com') {
        return {
          id: 1,
          firstname: 'Serkan',
          lastname: 'Dev',
          email: 'sdev@gmail.com',
          role: 'USER',
          checkPassword: jest.fn().mockResolvedValueOnce(true),
          generateToken: jest.fn().mockReturnValueOnce('token'),
        };
      }
      return null;
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('Login - Valid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'sdev@gmail.com', password: 'Test12345-' });

    expect(response.status).toBe(200);
    expect(response.headers['set-cookie']).toContain('token=token; Path=/');
    expect(response.body).toEqual('');
  });

  test('Login - User not found', async () => {
    User.findOne.mockResolvedValueOnce(null);

    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'sdev@gmail.com', password: 'Test12345-' });

    expect(response.status).toBe(404);
    expect(response.body).toEqual('');
  });

  test('Login - Invalid credentials', async () => {
    const mockUser = {
      id: 1,
      firstname: 'Serkan',
      lastname: 'Dev',
      email: 'sdev@gmail.com',
      password: 'hashedpassword',
      role: 'USER',
      checkPassword: jest.fn().mockResolvedValueOnce(false),
    };

    User.findOne.mockResolvedValueOnce(mockUser);

    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'sdev@gmail.com', password: 'Test1234!' });

    expect(response.status).toBe(401);
    expect(response.body).toEqual('');
  });

  test('Login - Invalid email format', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'invalidemail', password: 'Test1234!' });

    expect(response.status).toBe(422);
    expect(response.body).toEqual('');
  });

  test('Login - Invalid password format', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'sdev@gmail.com', password: 'short' });

    expect(response.status).toBe(422);
    expect(response.body).toEqual('');
  });
});
