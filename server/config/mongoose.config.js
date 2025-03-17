import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
console.log("MongoDB URI:", MONGODB_URI ? "URI loaded (sensitive - not displayed)" : "URI not found in .env");

async function dbConnect() {
    try {
        console.log("Connecting to MongoDB...");
        
        // Set up connection event listeners for better monitoring
        mongoose.connection.on('connected', () => {
            console.log('Mongoose connected to MongoDB');
        });
        
        mongoose.connection.on('error', (err) => {
            console.error(`Mongoose connection error: ${err}`);
        });
        
        mongoose.connection.on('disconnected', () => {
            console.log('Mongoose disconnected from MongoDB');
        });
        
        // Handle process termination
        process.on('SIGINT', async () => {
            await mongoose.connection.close();
            console.log('Mongoose connection closed due to app termination');
            process.exit(0);
        });
        
        // Connect with retry mechanism
        await mongoose.connect(MONGODB_URI, {
            dbName: 'fitDB',
            retryWrites: true,
            w: 'majority',
            connectTimeoutMS: 30000, // Increase timeout to 30 seconds
            socketTimeoutMS: 45000    // Increase socket timeout to 45 seconds
        });
        
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } catch (error) {
        console.log("Failed to connect to MongoDB:", error);
        console.log("Error details:", JSON.stringify(error, null, 2));
        throw error;
    }
}

export default dbConnect;