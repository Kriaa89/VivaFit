import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
// Removed printing the full URI
console.log("Connecting to MongoDB...");

async function testConnection() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");
    return mongoose.connection.close();
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
}

testConnection();