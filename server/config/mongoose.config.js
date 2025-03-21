import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

async function dbConnect() {
  try {
    await mongoose.connect(MONGODB_URI, {
      dbName: 'fitDB',
      retryWrites: true,
      w: 'majority'
    });
    
    mongoose.connection.on('error', err => {
      console.error('MongoDB connection error:', err);
    });
    
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      process.exit(0);
    });

  } catch (error) {
    throw error;
  }
}

export default dbConnect;