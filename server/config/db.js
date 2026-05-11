const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000 // Fast fail
    });
    console.log(`📡 MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`⚠️ Database Connection Failed: ${error.message}`);
    console.log('🚀 SYSTEM STARTING IN DEMO MODE (In-Memory Storage)');
    // We don't exit(1) here so the server stays alive
  }
};

module.exports = connectDB;
