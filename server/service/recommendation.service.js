import axios from 'axios';
import { GEMINI_API_KEY, GEMINI_API_URL } from '../config/gemini.config.js';

/**
 * Fitness Recommendation Service
 * 
 * This service generates personalized fitness recommendations by:
 * 1. Sending user criteria to Google's Gemini API to get initial exercise recommendations
 * 2. Fetching detailed exercise data from ExerciseDB
 * 3. Matching and filtering the exercises based on AI recommendations
 * 4. Returning a curated list of exercises with full details
 */
class RecommendationService {
  constructor() {
    this.exerciseDbBaseUrl = 'https://exercisedb-api.vercel.app/api/v1';
  }

  /**
   * Get personalized workout recommendations based on user criteria
   */
  async getRecommendations(criteria, userId) {
    try {
      // 1. Generate exercise recommendations (either from AI or fallback mechanism)
      let recommendedExercises;
      
      try {
        if (GEMINI_API_KEY) {
          recommendedExercises = await this.getAIRecommendations(criteria);
        } else {
          console.log('No Gemini API key found, using default recommendations');
          recommendedExercises = this.getDefaultExercises(criteria.goal, criteria.fitnessLevel);
        }
      } catch (error) {
        console.error('Error with AI recommendations, using default:', error);
        recommendedExercises = this.getDefaultExercises(criteria.goal, criteria.fitnessLevel);
      }
      
      // 2. Get exercise data from API
      const exerciseData = await this.getExerciseData();
      
      // 3. Match and filter exercises based on recommendations and equipment
      const matchedExercises = this.matchExercises(
        recommendedExercises, 
        exerciseData,
        criteria.equipment
      );
      
      return matchedExercises;
    } catch (error) {
      console.error('Error generating recommendations:', error);
      throw new Error('Failed to generate workout recommendations');
    }
  }

  /**
   * Call Gemini API to get AI-powered exercise recommendations
   */
  async getAIRecommendations(criteria) {
    try {
      const { bodyType, equipment, goal, fitnessLevel } = criteria;
      
      const prompt = `As a fitness expert, recommend 8-10 specific exercises for a ${fitnessLevel} level person with a ${bodyType} body type, 
        who has access to ${equipment || 'body weight'} equipment, and whose primary fitness goal is ${goal}.
        Provide ONLY the exact exercise names, separated by commas. Don't include any other text, explanations or numbering.
        Focus on exercises that target the main muscle groups needed for ${goal}.
        Examples of properly formatted response: "Squats, Deadlifts, Bench Press, Lat Pulldowns"`;
      
      const response = await axios.post(
        `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
        {
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.2,
            topK: 32,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        }
      );
      
      const generatedText = response.data.candidates[0]?.content?.parts[0]?.text;
      
      if (!generatedText) {
        throw new Error('Failed to get a valid response from Gemini API');
      }
      
      return generatedText
        .split(',')
        .map(ex => ex.trim())
        .filter(ex => ex.length > 0);
    } catch (error) {
      console.error('Error calling Gemini API:', error.message);
      return this.getDefaultExercises(criteria.goal, criteria.fitnessLevel);
    }
  }
  
  /**
   * Provide default exercises if the AI recommendation fails
   */
  getDefaultExercises(goal, level) {
    const defaultSets = {
      'weight loss': [
        'Jumping Jacks', 'Burpees', 'Mountain Climbers', 'Jump Rope', 'Squat Jumps', 
        'High Knees', 'Lunges', 'Push Ups', 'Plank', 'Russian Twists'
      ],
      'muscle gain': [
        'Bench Press', 'Squats', 'Deadlifts', 'Pull Ups', 'Shoulder Press',
        'Barbell Rows', 'Bicep Curls', 'Tricep Extensions', 'Lat Pulldowns', 'Leg Press'
      ],
      'strength': [
        'Deadlifts', 'Squats', 'Bench Press', 'Rows', 'Overhead Press',
        'Pull Ups', 'Lunges', 'Dips', 'Face Pulls', 'Romanian Deadlifts'
      ],
      'flexibility': [
        'Forward Lunges', 'Side Lunges', 'Leg Swings', 'Arm Circles', 'Hip Rotations',
        'Cat-Cow Stretch', 'Downward Dog', 'Child Pose', 'Cobra Stretch', 'Butterfly Stretch'
      ],
      'endurance': [
        'Running', 'Cycling', 'Swimming', 'Jump Rope', 'Rowing',
        'Elliptical Training', 'Stair Climbing', 'Burpees', 'Mountain Climbers', 'High Knees'
      ],
      'overall fitness': [
        'Push Ups', 'Squats', 'Lunges', 'Plank', 'Jumping Jacks',
        'Mountain Climbers', 'Burpees', 'Russian Twists', 'Pull Ups', 'Bicycle Crunches'
      ]
    };
    
    return defaultSets[goal?.toLowerCase()] || defaultSets['overall fitness'];
  }

  /**
   * Get exercise data from ExerciseDB API
   */
  async getExerciseData() {
    try {
      const response = await axios.get(`${this.exerciseDbBaseUrl}/exercises`);
      
      if (!response.data) {
        throw new Error('Invalid response from ExerciseDB API');
      }
      
      const exercises = Array.isArray(response.data) ? response.data : 
                       (response.data.data && Array.isArray(response.data.data)) ? response.data.data :
                       [];
      
      return exercises.map(ex => ({
        id: ex.id || `ex-${Math.random().toString(36).substring(2, 9)}`,
        name: ex.name || 'Unknown Exercise',
        bodyPart: ex.bodyPart || ex.target || 'general',
        equipment: ex.equipment || 'body weight',
        gifUrl: ex.gifUrl || null,
        target: ex.target || ex.bodyPart || 'general',
        instructions: ex.instructions || ['Perform the exercise with proper form'],
        secondaryMuscles: ex.secondaryMuscles || []
      }));
    } catch (error) {
      console.error('Error fetching exercise data:', error);
      return [];
    }
  }

  /**
   * Match and filter the AI recommended exercises with complete exercise data
   */
  matchExercises(recommendedNames, allExercises, preferredEquipment = 'body weight') {
    const matchedExercises = [];
    
    for (const name of recommendedNames) {
      let matches = allExercises.filter(ex => 
        ex.name && ex.name.toLowerCase().includes(name.toLowerCase())
      );
      
      const preferredMatches = matches.filter(ex => 
        ex.equipment && ex.equipment.toLowerCase() === preferredEquipment.toLowerCase()
      );
      
      const finalMatches = preferredMatches.length > 0 ? preferredMatches : matches;
      
      if (finalMatches.length > 0) {
        finalMatches.sort((a, b) => 
          Math.abs(a.name.length - name.length) - Math.abs(b.name.length - name.length)
        );
        
        matchedExercises.push(finalMatches[0]);
      }
    }
    
    if (matchedExercises.length < 5 && allExercises.length > 0) {
      const equipmentExercises = allExercises.filter(ex => 
        ex.equipment && ex.equipment.toLowerCase() === preferredEquipment.toLowerCase() &&
        !matchedExercises.some(match => match.id === ex.id)
      );
      
      const additionalExercises = equipmentExercises.length > 0 
        ? equipmentExercises.slice(0, 10 - matchedExercises.length)
        : allExercises
            .filter(ex => !matchedExercises.some(match => match.id === ex.id))
            .slice(0, 10 - matchedExercises.length);
      
      matchedExercises.push(...additionalExercises);
    }
    
    return matchedExercises;
  }
}

export default new RecommendationService();