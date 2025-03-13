import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
console.log("Attempting to connect to:", MONGODB_URI);

async function testConnection() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Successfully connected to MongoDB!");
    return mongoose.connection.close();
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
}

testConnection();