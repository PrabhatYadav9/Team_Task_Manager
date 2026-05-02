const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let memoryServer;
let usingFallback = false;

const getFallbackUri = async () => {
  if (!memoryServer) {
    memoryServer = await MongoMemoryServer.create();
  }

  return memoryServer.getUri('team-task-manager');
};

const connectDB = async () => {
  try {
    const primaryUri = process.env.MONGO_URI || 'mongodb://localhost:27017/team-task-manager';

    let conn;
    try {
      conn = await mongoose.connect(primaryUri);
      usingFallback = false;
    } catch (primaryError) {
      console.warn(`Primary MongoDB connection failed: ${primaryError.message}`);
      if (process.env.NODE_ENV === 'production' || process.env.RAILWAY_ENVIRONMENT) {
        console.error('Cannot use in-memory fallback in production. Exiting.');
        process.exit(1);
      }
      const fallbackUri = await getFallbackUri();
      conn = await mongoose.connect(fallbackUri);
      console.log('Connected to in-memory MongoDB fallback');
      usingFallback = true;
    }

    console.log(`MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

connectDB.usingFallback = () => usingFallback;

module.exports = connectDB;
