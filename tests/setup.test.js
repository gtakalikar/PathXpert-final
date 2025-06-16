const mongoose = require('mongoose');
const { describe, it, expect, jest } = require('@jest/globals');

describe('Test Setup', () => {
  it('should connect to MongoDB', () => {
    expect(mongoose.connection.readyState).toBe(1); // 1 means connected
  });

  it('should have test environment variables', () => {
    expect(process.env.NODE_ENV).toBe('test');
    expect(process.env.JWT_SECRET).toBeDefined();
    expect(process.env.MONGODB_URI).toBeDefined();
  });
}); 