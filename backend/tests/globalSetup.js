const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

module.exports = async () => {
  const mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  
  global.__MONGO_URI__ = mongoUri;
  global.__MONGO_SERVER__ = mongoServer;
  
  await mongoose.connect(mongoUri);
}; 