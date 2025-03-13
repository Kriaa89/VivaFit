import { connect } from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
console.log("MongoDB URI:", MONGODB_URI ? "URI loaded (sensitive - not displayed)" : "URI not found in .env");

async function dbConnect() {
    try {
        await connect(MONGODB_URI, {
            dbName: 'fitDB',
            retryWrites: true,
            w: 'majority'
        });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } catch (error) {
        console.log("Failed to connect to MongoDB:", error);
        console.log("Error details:", JSON.stringify(error, null, 2));
        throw error;
    }
}

export default dbConnect;