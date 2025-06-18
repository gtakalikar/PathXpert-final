const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { beforeAll, beforeEach, describe, it } = require('@jest/globals');
const app = require('../server');
const User = require('../models/User');
const Report = require('../models/Report');
const admin = require('../config/firebase');

let testUser;
let authToken;

beforeAll(async () => {
  // Create or get existing test user
  testUser = await User.findOneAndUpdate(
    { uid: 'test-uid-123' },
    { 
      uid: 'test-uid-123',
      email: 'test@example.com',
      displayName: 'Test User'
    },
    { upsert: true, new: true }
  );

  // Mock Firebase token verification to properly decode our JWT
  admin.auth().verifyIdToken.mockImplementation((token) => {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return Promise.resolve({
        uid: decoded.uid,
        email: decoded.email,
        name: decoded.name,
        picture: decoded.picture
      });
    } catch (err) {
      return Promise.reject(new Error('Invalid token'));
    }
  });

  // Generate test JWT token directly with additional claims
  authToken = jwt.sign(
    {
      uid: testUser.uid,
      email: testUser.email,
      role: 'user', // Ensure role is set
      name: testUser.displayName, // Include name
      picture: null // Include picture if needed
    },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
});

beforeEach(async () => {
  await Report.deleteMany({});
  jest.clearAllMocks();
});

describe('User Controller', () => {
  describe('GET /api/users/profile', () => {
    it('should get user profile successfully', async () => {
      const response = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('email', testUser.email);
      expect(response.body).toHaveProperty('displayName', testUser.displayName);
    });

    it('should return 401 if not authenticated', async () => {
      const response = await request(app)
        .get('/api/users/profile');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'Unauthorized - No token provided');
    });
  });

  describe('PUT /api/users/profile', () => {
    const updateData = {
      displayName: 'Updated Test User',
      photoURL: 'https://example.com/photo.jpg'
    };

    it('should update user profile successfully', async () => {
      const response = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Profile updated successfully');
      expect(response.body.user.displayName).toBe(updateData.displayName);
      expect(response.body.user.photoURL).toBe(updateData.photoURL);
    });

    it('should return 400 if validation fails', async () => {
      const response = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          displayName: 'a' // Too short
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Validation Error');
    });
  });

  describe('GET /api/users/history', () => {
    beforeEach(async () => {
      // Create some test reports for the user
      await Report.create([
        {
          userId: testUser._id,
          type: 'hazard',
          location: {
            type: 'Point',
            coordinates: [-73.935242, 40.730610]
          },
          description: 'Test hazard 1',
          severity: 'medium',
          status: 'active'
        },
        {
          userId: testUser._id,
          type: 'obstacle',
          location: {
            type: 'Point',
            coordinates: [-73.935242, 40.730610]
          },
          description: 'Test obstacle 1',
          severity: 'high',
          status: 'resolved'
        }
      ]);
    });

    it('should get user report history with pagination', async () => {
      const response = await request(app)
        .get('/api/users/history')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ page: 1, limit: 10 });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('reports');
      expect(response.body).toHaveProperty('pagination');
      expect(response.body.reports).toHaveLength(2);
    });

    it('should filter reports by status', async () => {
      const response = await request(app)
        .get('/api/users/history')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ status: 'active' });

      expect(response.status).toBe(200);
      expect(response.body.reports).toHaveLength(1);
      expect(response.body.reports[0].status).toBe('active');
    });
  });

  describe('GET /api/users/stats', () => {
    beforeEach(async () => {
      // Create test reports with different types and severities
      await Report.create([
        {
          userId: testUser._id,
          type: 'hazard',
          location: {
            type: 'Point',
            coordinates: [-73.935242, 40.730610]
          },
          description: 'Test hazard 1',
          severity: 'medium',
          status: 'active'
        },
        {
          userId: testUser._id,
          type: 'hazard',
          location: {
            type: 'Point',
            coordinates: [-73.935242, 40.730610]
          },
          description: 'Test hazard 2',
          severity: 'high',
          status: 'resolved'
        },
        {
          userId: testUser._id,
          type: 'obstacle',
          location: {
            type: 'Point',
            coordinates: [-73.935242, 40.730610]
          },
          description: 'Test obstacle 1',
          severity: 'low',
          status: 'active'
        }
      ]);
    });

    it('should get user statistics successfully', async () => {
      const response = await request(app)
        .get('/api/users/stats')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('totalReports', 3);
      expect(response.body).toHaveProperty('reportsByStatus');
      expect(response.body).toHaveProperty('reportsByType');
      expect(response.body).toHaveProperty('reportsBySeverity');
    });
  });
}); 