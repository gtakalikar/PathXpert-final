const request = require('supertest');
const app = require('../server');
const User = require('../models/User');
const admin = require('../config/firebase');
const jwt = require('jsonwebtoken');

jest.mock('../config/firebase');

describe('Auth Controller', () => {
  afterAll(async () => {
    await User.deleteMany({});
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      // Mock Firebase user creation
      admin.auth().createUser.mockResolvedValue({
        uid: 'test-uid-123',
        email: 'test@example.com',
        displayName: 'Test User'
      });

      // Mock User model creation
      User.create.mockResolvedValue({
        uid: 'test-uid-123',
        email: 'test@example.com',
        displayName: 'Test User',
        role: 'user',
        save: jest.fn().mockResolvedValue(true)
      });

      const res = await request(app).post('/api/auth/register').send({
        email: 'test@example.com',
        password: 'Password123',
        displayName: 'Test User'
      });
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body).toHaveProperty('user');
    });

    it('should not register with missing fields', async () => {
      const res = await request(app).post('/api/auth/register').send({
        email: 'test@example.com'
      });
      expect(res.statusCode).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login an existing user', async () => {
      // Mock Firebase user retrieval
      admin.auth().getUserByEmail.mockResolvedValue({
        uid: 'test-uid-123',
        email: 'test@example.com',
        displayName: 'Test User'
      });

      // Mock User model find
      User.findOne.mockResolvedValue({
        uid: 'test-uid-123',
        email: 'test@example.com',
        displayName: 'Test User',
        role: 'user',
        lastLogin: new Date(),
        save: jest.fn().mockResolvedValue(true)
      });

      const res = await request(app).post('/api/auth/login').send({
        email: 'test@example.com',
        password: 'Password123'
      });
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
    });

    it('should return 401 for invalid credentials', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'wrong@example.com',
        password: 'WrongPassword'
      });
      expect(res.statusCode).toBe(401);
    });
  });
});

describe('Authentication Tests', () => {
  const testUser = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'TestPass123!'
  };

  describe('Registration', () => {
    it('should register a new user successfully', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser);

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toHaveProperty('id');
      expect(res.body.user.email).toBe(testUser.email);
      expect(res.body.user.name).toBe(testUser.name);
    });

    it('should not register with duplicate email', async () => {
      // First registration
      await request(app)
        .post('/api/auth/register')
        .send(testUser);

      // Second registration with same email
      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser);

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('Email already registered');
    });

    it('should validate required fields', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: '',
          email: 'invalid-email',
          password: '123'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.errors).toBeDefined();
    });
  });

  describe('Login', () => {
    beforeEach(async () => {
      // Register a user before each login test
      await request(app)
        .post('/api/auth/register')
        .send(testUser);
    });

    it('should login successfully with correct credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toHaveProperty('id');
      expect(res.body.user.email).toBe(testUser.email);
    });

    it('should not login with incorrect password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword'
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toBe('Invalid credentials');
    });

    it('should not login with non-existent email', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: testUser.password
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toBe('Invalid credentials');
    });
  });

  describe('Get Current User', () => {
    let token;

    beforeEach(async () => {
      // Register and login to get token
      await request(app)
        .post('/api/auth/register')
        .send(testUser);

      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });

      token = loginRes.body.token;
    });

    it('should get current user with valid token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.user).toHaveProperty('id');
      expect(res.body.user.email).toBe(testUser.email);
    });

    it('should not get current user without token', async () => {
      const res = await request(app)
        .get('/api/auth/me');

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toBe('No token provided');
    });

    it('should not get current user with invalid token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token');

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toBe('Invalid token');
    });
  });
});
