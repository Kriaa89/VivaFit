// recommendation.controller.js
import User from '../models/user.model.js';
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
  
  // Save recommendations to user model
  try {
    const user = await User.findById(userId);
    
    if (user) {
      user.recommendations.push({
        timestamp: new Date(),
        criteria: {
          bodyType,
          equipment, 
          goal,
          fitnessLevel
        },
        exercises: recommendations.map(ex => ({
          id: ex.id,
          name: ex.name,
          bodyPart: ex.bodyPart
        }))
      });
      
      await user.save();
    }
  } catch (error) {
    // Log error but don't fail the request
    console.error('Failed to save recommendations to user profile:', error);
  }
  
  res.status(200).json({
    success: true,
    data: recommendations
  });
});

/**
 * Get user's recommendation history
 * @route GET /api/recommendations/history
 * @access Private - requires authentication
 */
export const getRecommendationHistory = asyncHandler(async (req, res) => {
  const user = await User.findById(req.dbUser.id);
  
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  
  res.status(200).json({
    success: true,
    data: user.recommendations
  });
});

/**
 * Delete a specific recommendation from user history
 * @route DELETE /api/recommendations/:recommendationId
 * @access Private - requires authentication
 */
export const deleteRecommendation = asyncHandler(async (req, res) => {
  const { recommendationId } = req.params;
  const user = await User.findById(req.dbUser.id);
  
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  
  const recommendationIndex = user.recommendations.findIndex(
    rec => rec._id.toString() === recommendationId
  );
  
  if (recommendationIndex === -1) {
    res.status(404);
    throw new Error('Recommendation not found');
  }
  
  // Remove the recommendation
  user.recommendations.splice(recommendationIndex, 1);
  await user.save();
  
  res.status(200).json({
    success: true,
    message: 'Recommendation deleted successfully'
  });
});