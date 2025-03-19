import express from "express";
import cors from 'cors';
import dotenv from 'dotenv';
import dbConnect from "./config/mongoose.config.js";
import userRoutes from "./routes/user.routes.js";
import programRoutes from "./routes/program.routes.js"; 
import { errorHandler } from "./middleware/error.middleware.js";

// Load environment variables
dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;

// Basic middleware
app.use(express.json());
app.use(cors());

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
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    await dbConnect();
    app.listen(PORT, () => {
      // Server start is logged by process manager
    });
  } catch (error) {
    process.exit(1);
  }
};

startServer();