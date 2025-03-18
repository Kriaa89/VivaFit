import express from "express";
import cors from 'cors';
import dotenv from 'dotenv';
import dbConnect from "./config/mongoose.config.js";
import userRoutes from "./routes/user.routes.js";
import recommendationRoutes from "./routes/recommendation.routes.js";
import exerciseRoutes from "./routes/exercise.routes.js";
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
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/exercises", exerciseRoutes);

// Error handling
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    await dbConnect();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();