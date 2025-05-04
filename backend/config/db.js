const mongoose = require('mongoose');
const path = require('path');

// We don't need to load dotenv here as it's already loaded in server.js

const connectDB = async () => {
  try {
    // Log the MongoDB URI to debug (remove in production)
    console.log('Attempting to connect to MongoDB with URI:', process.env.MONGO_URI);
    
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = { connectDB };
