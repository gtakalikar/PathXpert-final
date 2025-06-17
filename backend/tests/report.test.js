const request = require('supertest');
const app = require('../server');
const Report = require('../models/Report');
const User = require('../models/User');

describe('Report Controller', () => {
  let testUser;
  let authToken;

  beforeAll(async () => {
    // Create test user
    testUser = await User.create({
      uid: 'test-uid-123',
      email: 'test@example.com',
      displayName: 'Test User'
    });

    // Generate test token
    authToken = 'test-auth-token';
  });

  afterAll(async () => {
    await Report.deleteMany({});
    await User.deleteMany({});
  });

  describe('POST /api/reports', () => {
    it('should create a report successfully', async () => {
      // Mock report creation response
      const res = await request(app)
        .post('/api/reports')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          type: 'hazard',
          location: {
            type: 'Point',
            coordinates: [-73.935242, 40.730610]
          },
          description: 'Test hazard',
          severity: 'medium'
        });
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('report');
      expect(res.body.report).toHaveProperty('_id');
    });

    it('should require authentication', async () => {
      const res = await request(app)
        .post('/api/reports')
        .send({
          type: 'hazard',
          description: 'Test hazard'
        });
      expect(res.statusCode).toBe(401);
    });
  });

  describe('GET /api/reports', () => {
    it('should retrieve reports', async () => {
      const res = await request(app)
        .get('/api/reports')
        .set('Authorization', `Bearer ${authToken}`);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('reports');
      expect(Array.isArray(res.body.reports)).toBeTruthy();
    });
  });
});
