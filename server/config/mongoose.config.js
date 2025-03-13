import { connect } from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const MONGODB_URI = process.env.MONGODB_URI;
async function dbConnect() {
    try {
        await connect(MONGODB_URI, {
            dbName: 'FitDb',
        });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } catch (error) {
        console.log("Failed to connect to MongoDB:", error);
        throw error;
    }
}
export default dbConnect;