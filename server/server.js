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

// Add a test endpoint to verify server is working
app.get("/api/test", (req, res) => {
    res.json({ message: "Server is working correctly" });
});

// Routes
app.use("/api/users", userRoutes);
// Add other routes as needed

// Improved error handling middleware
app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);
    console.error("Error stack:", err.stack);
    
    res.status(500).json({
        error: true,
        message: "Internal server error",
        details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Standard error handling middleware
app.use(errorHandler);

// Connect to database
dbConnect().catch(err => {
    console.error("Database connection failed:", err);
    // Continue running the server even if DB connection fails
});

// Port configuration
const PORT = process.env.PORT || 8080;

// Start server
app.listen(PORT, () => 
    console.log(`Server is running on port ${PORT}`)
);