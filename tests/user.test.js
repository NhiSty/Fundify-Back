const request = require('supertest');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = require('../app');
const User = require('../models/User');
require('dotenv').config();

describe('Signup API', () => {

  beforeEach(async () => {
    // Delete user that was created during previous test
    await User.deleteOne({ email: 'test@test.com' });
  });

  it('should create a new user', async () => {
    const userData = {
      email: 'test@test.com',
      password: 'Test1234&*',
      society: 'Nhisty',
      kbis: 'Lorem ipsum dolor sit amet...',
      curenncy: 'EUR',
    };

    await request(app)
      .post('/api/auth/signup')
      .send(userData)
      .expect(201)
      .then((response) => {
        expect(response.body.message).toBe('User created successfully!');
        expect(response.body.data.email).toBe(userData.email);
        expect(response.body.data.society).toBe(userData.society);
        expect(response.body.data.kbis).toBe(userData.kbis);
        expect(response.body.data.curenncy).toBe(userData.curenncy);
        expect(response.body.data).toHaveProperty('userId');
      });

    // Verify that the user is saved in the database
    const user = await User.findOne({ email: userData.email });
    expect(user).toBeTruthy();
    expect(user.email).toBe(userData.email);

    // Verify that the password is hashed
    const isPasswordMatch = await bcrypt.compare(
      userData.password,
      user.password
    );
    expect(isPasswordMatch).toBeTruthy();
  });

  it('should return an error if email already exists', async () => {
    const existingUser = new User({
      email: 'test@test.com',
      password: 'password',
      society: 'Nhisty',
      kbis: 'Lorem ipsum dolor sit amet...',
      curenncy: 'EUR',
    });
    await existingUser.save();

    const userData = {
      email: 'test@test.com',
      password: 'Test1234&*',
      society: 'NewSociety',
      kbis: 'Lorem ipsum dolor sit amet...',
      curenncy: 'USD',
    };

    await request(app)
      .post('/api/auth/signup')
      .send(userData)
      .expect(409)
      .then((response) => {
        expect(response.body.error).toBe('User already exists');
      });
  });

});
