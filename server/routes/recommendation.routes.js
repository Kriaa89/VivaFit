// recommendation.routes.js
import express from 'express';
import { verifyToken, checkUserExists } from '../middleware/auth.middleware.js';
import { generateRecommendations } from '../controllers/recommendation.controller.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(verifyToken);
router.use(checkUserExists);

// Routes
router.post('/', generateRecommendations);

export default router;