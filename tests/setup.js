const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { beforeAll, afterAll, afterEach, jest } = require('@jest/globals');

// Load environment variables from .env.test
process.env.NODE_ENV = 'test';
require('dotenv').config({ path: '.env.test' });

// Ensure JWT_SECRET is set for tests
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret-key';
process.env.JWT_EXPIRES_IN = '1h';

// Set default timeout for all tests
jest.setTimeout(30000);

// Mock console.error to keep test output clean
console.error = jest.fn();

// Mock Firebase Admin to bypass actual verification
jest.mock('../config/firebase', () => ({
  auth: jest.fn(() => ({
    createUser: jest.fn(),
    getUserByEmail: jest.fn(),
    verifyIdToken: jest.fn((token) => {
      // Return a basic decoded token structure
      return Promise.resolve({
        uid: 'test-uid-123',
        email: 'test@example.com',
        name: 'Test User'
      });
    })
  })),
  messaging: jest.fn(() => ({
    send: jest.fn(),
    sendMulticast: jest.fn()
  }))
}));

let mongod;

// Setup before all tests
beforeAll(async () => {
  // Create an in-memory MongoDB instance
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();

  // Connect to the in-memory database
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
});

// Clean up after each test
afterEach(async () => {
  // Clear all collections
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
});

// Clean up after all tests
afterAll(async () => {
  // Close the database connection
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongod.stop();
});
