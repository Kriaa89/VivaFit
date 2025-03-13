import express from "express";
import cors from 'cors';
import dotenv from 'dotenv';
import dbConnect from "./config/mongoose.config.js";
import userRoutes from "./routes/user.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";

// Initialize express app
const app = express();

// Load environment variables
dotenv.config();

// Middleware
app.use(express.json());
app.use(cors());

// Port configuration
const PORT = process.env.PORT || 8080;

// Routes
app.use("/api/users", userRoutes);
// Add other routes as needed

// Error handling middleware
app.use(errorHandler);

// Connect to database
dbConnect();

// Start server
app.listen(PORT, () => 
    console.log(`Server is running on port ${PORT}`)
);