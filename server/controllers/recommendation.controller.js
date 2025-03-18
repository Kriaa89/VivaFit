// recommendation.controller.js
import recommendationService from '../service/recommendation.service.js';
import asyncHandler from 'express-async-handler';

/**
 * Generate personalized workout recommendations for a user
 * @route POST /api/recommendations
 * @access Private - requires authentication
 */
export const generateRecommendations = asyncHandler(async (req, res) => {
  const { bodyType, equipment, goal, fitnessLevel } = req.body;
  const userId = req.dbUser.id;
  
  // Validate required parameters
  if (!bodyType || !goal || !fitnessLevel) {
    res.status(400);
    throw new Error('Missing required parameters: bodyType, goal, and fitnessLevel are required');
  }

  // Generate workout recommendations
  const recommendations = await recommendationService.getRecommendations(
    { bodyType, equipment, goal, fitnessLevel },
    userId
  );
  
  res.status(200).json({
    success: true,
    data: recommendations
  });
});