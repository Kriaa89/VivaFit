import express from "express";
import cors from 'cors';
import dotenv from 'dotenv';
import dbConnect from "./config/mongoose.config.js";
import userRoutes from "./routes/user.routes.js";
import programRoutes from "./routes/program.routes.js"; 
import { errorHandler } from "./middleware/error.middleware.js";
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Get current directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;

// Basic middleware
app.use(express.json());
app.use(cors());

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve static files from uploads directory
app.use('/uploads', express.static(uploadsDir));

// Simple health check
app.get("/api/health", (_, res) => {
  res.json({ status: "ok" });
});

// Routes
app.use("/api/users", userRoutes);
app.use("/api/programs", programRoutes);

app.get('/api/dashboard', (req, res) => {
  // Replace with actual data fetching logic
  const dashboardData = {
    message: 'This is the dashboard data from the server.',
    // Add more data as needed
  };
  res.json(dashboardData);
});

// Error handling
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        success: false, 
        message: 'Internal Server Error',
        error: err.message 
    });
});
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    await dbConnect();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Uploads directory: ${uploadsDir}`);
    });
  } catch (error) {
    process.exit(1);
  }
};

startServer();