// recommendation.routes.js
import express from 'express';
import { verifyToken, checkUserExists } from '../middleware/auth.middleware.js';
import { 
  generateRecommendations,
  getRecommendationHistory,
  deleteRecommendation
} from '../controllers/recommendation.controller.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(verifyToken);
router.use(checkUserExists);

// Routes
router.post('/', generateRecommendations);
router.get('/history', getRecommendationHistory);
router.delete('/:recommendationId', deleteRecommendation);

export default router;