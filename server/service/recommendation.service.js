// recommendation.service.js
import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { GEMINI_API_KEY, GEMINI_API_URL } from '../config/gemini.config.js';

// Get the directory name using ES modules syntax
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Fitness Recommendation Service
 * 
 * This service generates personalized fitness recommendations by:
 * 1. Sending user criteria to Google's Gemini API to get initial exercise recommendations
 * 2. Fetching detailed exercise data from ExerciseDB or local cache
 * 3. Matching and filtering the exercises based on AI recommendations
 * 4. Returning a curated list of exercises with full details (instructions, images, etc.)
 */
class RecommendationService {
  constructor() {
    this.exerciseDbBaseUrl = 'https://exercisedb-api.vercel.app/api/v1';
    this.exerciseCachePath = path.join(__dirname, '../data/exercises-cache.json');
    this.equipmentCachePath = path.join(__dirname, '../data/equipment-cache.json');
    this.bodyPartsCachePath = path.join(__dirname, '../data/bodyparts-cache.json');
    this.musclesCachePath = path.join(__dirname, '../data/muscles-cache.json');
    this.recommendationHistoryPath = path.join(__dirname, '../data/recommendation-history.json');
    
    // Create cache directory if it doesn't exist
    this.initializeDataDirectory();
    
    // Prime the caches for faster responses
    this.primeApiCaches();
  }

  /**
   * Ensure the data directory exists
   */
  async initializeDataDirectory() {
    const dataDir = path.join(__dirname, '../data');
    try {
      await fs.access(dataDir);
    } catch (error) {
      // Directory doesn't exist, create it
      await fs.mkdir(dataDir, { recursive: true });
      console.log('Created data directory for exercise caching');
    }
  }
  
  /**
   * Load API data into caches in the background
   */
  async primeApiCaches() {
    try {
      // Start fetching equipment, bodyparts, and muscles in parallel
      Promise.all([
        this.getEquipment(),
        this.getBodyParts(),
        this.getMuscles()
      ]).then(() => {
        console.log('API caches primed successfully');
      });
    } catch (error) {
      console.error('Error priming API caches:', error);
    }
  }
  
  /**
   * Get all available equipment from API or cache
   * @returns {Promise<Array>} List of equipment
   */
  async getEquipment() {
    try {
      // Try to read from cache first
      try {
        const cacheData = await fs.readFile(this.equipmentCachePath, 'utf-8');
        const equipment = JSON.parse(cacheData);
        
        if (equipment && equipment.length > 0) {
          return equipment;
        }
      } catch (error) {
        // Cache doesn't exist or is invalid, will fetch from API
      }
      
      // Fetch equipment from API
      const response = await axios.get(`${this.exerciseDbBaseUrl}/equipments`);
      const equipment = response.data.data || [];
      
      // Save to cache
      await fs.writeFile(this.equipmentCachePath, JSON.stringify(equipment, null, 2));
      
      return equipment;
    } catch (error) {
      console.error('Error fetching equipment:', error);
      return [];
    }
  }
  
  /**
   * Get all available body parts from API or cache
   * @returns {Promise<Array>} List of body parts
   */
  async getBodyParts() {
    try {
      // Try to read from cache first
      try {
        const cacheData = await fs.readFile(this.bodyPartsCachePath, 'utf-8');
        const bodyParts = JSON.parse(cacheData);
        
        if (bodyParts && bodyParts.length > 0) {
          return bodyParts;
        }
      } catch (error) {
        // Cache doesn't exist or is invalid, will fetch from API
      }
      
      // Fetch body parts from API
      const response = await axios.get(`${this.exerciseDbBaseUrl}/bodyparts`);
      const bodyParts = response.data.data || [];
      
      // Save to cache
      await fs.writeFile(this.bodyPartsCachePath, JSON.stringify(bodyParts, null, 2));
      
      return bodyParts;
    } catch (error) {
      console.error('Error fetching body parts:', error);
      return [];
    }
  }
  
  /**
   * Get all available muscles from API or cache
   * @returns {Promise<Array>} List of muscles
   */
  async getMuscles() {
    try {
      // Try to read from cache first
      try {
        const cacheData = await fs.readFile(this.musclesCachePath, 'utf-8');
        const muscles = JSON.parse(cacheData);
        
        if (muscles && muscles.length > 0) {
          return muscles;
        }
      } catch (error) {
        // Cache doesn't exist or is invalid, will fetch from API
      }
      
      // Fetch muscles from API
      const response = await axios.get(`${this.exerciseDbBaseUrl}/muscles`);
      const muscles = response.data.data || [];
      
      // Save to cache
      await fs.writeFile(this.musclesCachePath, JSON.stringify(muscles, null, 2));
      
      return muscles;
    } catch (error) {
      console.error('Error fetching muscles:', error);
      return [];
    }
  }

  /**
   * Get personalized workout recommendations based on user criteria
   * @param {Object} criteria - Contains bodyType, equipment, goal, and fitnessLevel
   * @param {String} userId - User ID to save recommendations for the user
   * @returns {Array} - List of recommended exercises with details
   */
  async getRecommendations(criteria, userId) {
    try {
      // 1. Generate exercise recommendations (either from AI or fallback mechanism)
      let recommendedExercises;
      
      // Try using the Gemini API if key is available, otherwise use fallback
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
      
      // 2. Get exercise data from cache or API
      const exerciseData = await this.getExerciseData();
      
      // 3. Match and filter exercises based on recommendations and equipment
      const matchedExercises = this.matchExercises(
        recommendedExercises, 
        exerciseData,
        criteria.equipment
      );
      
      // 4. Save recommendation to user history if userId provided
      if (userId) {
        await this.saveRecommendationToHistory(userId, criteria, matchedExercises);
      }
      
      return matchedExercises;
    } catch (error) {
      console.error('Error generating recommendations:', error);
      throw new Error('Failed to generate workout recommendations');
    }
  }

  /**
   * Call Gemini API to get AI-powered exercise recommendations
   * @param {Object} criteria - User's workout preferences and constraints
   * @returns {Array} - List of recommended exercise names
   */
  async getAIRecommendations(criteria) {
    try {
      const { bodyType, equipment, goal, fitnessLevel } = criteria;
      
      // Construct a detailed prompt for Gemini
      const prompt = `As a fitness expert, recommend 8-10 specific exercises for a ${fitnessLevel} level person with a ${bodyType} body type, 
        who has access to ${equipment || 'body weight'} equipment, and whose primary fitness goal is ${goal}.
        Provide ONLY the exact exercise names, separated by commas. Don't include any other text, explanations or numbering.
        Focus on exercises that target the main muscle groups needed for ${goal}.
        Examples of properly formatted response: "Squats, Deadlifts, Bench Press, Lat Pulldowns"`;
      
      // Call Gemini API
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
      
      // Extract the generated text from the response
      const generatedText = response.data.candidates[0]?.content?.parts[0]?.text;
      
      if (!generatedText) {
        throw new Error('Failed to get a valid response from Gemini API');
      }
      
      // Process and clean the exercise names
      const exercises = generatedText
        .split(',')
        .map(ex => ex.trim())
        .filter(ex => ex.length > 0);
      
      return exercises;
    } catch (error) {
      console.error('Error calling Gemini API:', error.message);
      // Fallback to default exercises if API call fails
      return this.getDefaultExercises(criteria.goal, criteria.fitnessLevel);
    }
  }
  
  /**
   * Provide default exercises if the AI recommendation fails
   * @param {String} goal - Fitness goal
   * @param {String} level - Fitness level
   * @returns {Array} - List of default exercise names
   */
  getDefaultExercises(goal, level) {
    // Add more exercise options based on level
    const levelMultiplier = level === 'beginner' ? 1 : level === 'intermediate' ? 1.5 : 2;
    
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
    
    // Return the default exercises for the given goal, or overall fitness exercises if goal not found
    return defaultSets[goal?.toLowerCase()] || defaultSets['overall fitness'];
  }

  /**
   * Get exercise data from local cache or fetch from API
   * @returns {Array} - Complete list of exercises with details
   */
  async getExerciseData() {
    try {
      // Try to read from cache first
      try {
        const cacheData = await fs.readFile(this.exerciseCachePath, 'utf-8');
        const exercises = JSON.parse(cacheData);
        
        if (exercises && exercises.length > 0) {
          return exercises;
        }
      } catch (error) {
        // Cache doesn't exist or is invalid, will fetch from API
        console.log('Exercise cache not found or invalid, fetching from API...');
      }
      
      // Fetch exercises from ExerciseDB API
      try {
        const response = await axios.get(`${this.exerciseDbBaseUrl}/exercises`);
        
        if (!response.data) {
          throw new Error('Invalid response from ExerciseDB API');
        }
        
        // Handle different response formats
        let exercises;
        if (Array.isArray(response.data)) {
          exercises = response.data;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          exercises = response.data.data;
        } else {
          throw new Error('Unexpected response format from ExerciseDB API');
        }
        
        // Create a complete exercise dataset
        const processedExercises = exercises.map(ex => {
          // Ensure each exercise has all required properties
          return {
            id: ex.id || `ex-${Math.random().toString(36).substring(2, 9)}`,
            name: ex.name || 'Unknown Exercise',
            bodyPart: ex.bodyPart || ex.target || 'general',
            equipment: ex.equipment || 'body weight',
            gifUrl: ex.gifUrl || null,
            target: ex.target || ex.bodyPart || 'general',
            instructions: ex.instructions || ['Perform the exercise with proper form'],
            secondaryMuscles: ex.secondaryMuscles || []
          };
        });
        
        // Save to cache for future use
        await fs.writeFile(
          this.exerciseCachePath,
          JSON.stringify(processedExercises, null, 2)
        );
        
        return processedExercises;
      } catch (apiError) {
        console.error('Error fetching from API:', apiError.message);
        throw apiError;
      }
    } catch (error) {
      console.error('Error fetching exercise data:', error);
      
      // Try to use the fallback exercise data
      try {
        // Create some basic exercise data as fallback
        const basicExerciseData = [
          {
            id: 'ex-001',
            name: 'Push Ups',
            bodyPart: 'chest',
            equipment: 'body weight',
            target: 'pectorals',
            gifUrl: 'https://example.com/pushup.gif',
            instructions: 'Start in a plank position. Lower your body until your chest nearly touches the floor. Pause, then push back up.'
          },
          {
            id: 'ex-002',
            name: 'Squats',
            bodyPart: 'upper legs',
            equipment: 'body weight',
            target: 'quads',
            gifUrl: 'https://example.com/squat.gif',
            instructions: 'Stand with feet shoulder-width apart. Lower your body by bending knees and pushing hips back. Return to start.'
          },
          {
            id: 'ex-003',
            name: 'Lunges',
            bodyPart: 'upper legs',
            equipment: 'body weight',
            target: 'quads',
            gifUrl: 'https://example.com/lunge.gif',
            instructions: 'Take a step forward, lowering your hips until both knees are bent at 90 degrees. Return to start and repeat with other leg.'
          },
          {
            id: 'ex-004',
            name: 'Deadlifts',
            bodyPart: 'back',
            equipment: 'barbell',
            target: 'lower back',
            gifUrl: 'https://example.com/deadlift.gif',
            instructions: 'Stand with feet hip-width apart, barbell over feet. Bend at hips and knees, grasp bar. Drive through heels to stand up.'
          },
          {
            id: 'ex-005',
            name: 'Bench Press',
            bodyPart: 'chest',
            equipment: 'barbell',
            target: 'pectorals',
            gifUrl: 'https://example.com/bench.gif',
            instructions: 'Lie on bench, feet on floor. Grasp bar with hands slightly wider than shoulder-width. Lower bar to chest, then push back up.'
          },
          {
            id: 'ex-006',
            name: 'Pull Ups',
            bodyPart: 'back',
            equipment: 'body weight',
            target: 'lats',
            gifUrl: 'https://example.com/pullup.gif',
            instructions: 'Hang from bar with hands wider than shoulder-width. Pull body up until chin is over bar. Lower and repeat.'
          },
          {
            id: 'ex-007',
            name: 'Planks',
            bodyPart: 'waist',
            equipment: 'body weight',
            target: 'abs',
            gifUrl: 'https://example.com/plank.gif',
            instructions: 'Start in push-up position but with weight on forearms. Keep body straight from head to heels. Hold position.'
          },
          {
            id: 'ex-008',
            name: 'Burpees',
            bodyPart: 'cardio',
            equipment: 'body weight',
            target: 'cardiovascular system',
            gifUrl: 'https://example.com/burpee.gif',
            instructions: 'Begin standing, drop to squat, kick feet back to plank, do a push-up, jump feet to hands, leap up with hands overhead.'
          },
          {
            id: 'ex-009',
            name: 'Shoulder Press',
            bodyPart: 'shoulders',
            equipment: 'dumbbell',
            target: 'deltoids',
            gifUrl: 'https://example.com/shoulderpress.gif',
            instructions: 'Sit or stand with dumbbells at shoulder height. Press weights overhead until arms fully extend. Lower and repeat.'
          },
          {
            id: 'ex-010',
            name: 'Bicep Curls',
            bodyPart: 'upper arms',
            equipment: 'dumbbell',
            target: 'biceps',
            gifUrl: 'https://example.com/bicepcurl.gif',
            instructions: 'Stand with dumbbells at sides, palms forward. Bend elbows and curl weights toward shoulders. Lower and repeat.'
          }
        ];
        
        // Create cache file with basic exercises
        await fs.writeFile(
          this.exerciseCachePath,
          JSON.stringify(basicExerciseData, null, 2)
        );
        
        return basicExerciseData;
      } catch (fallbackError) {
        console.error('Error creating fallback exercise data:', fallbackError);
        // Last resort - return an empty array
        return [];
      }
    }
  }

  /**
   * Match and filter the AI recommended exercises with complete exercise data
   * @param {Array} recommendedNames - Exercise names recommended by AI
   * @param {Array} allExercises - Complete exercise data with details
   * @param {String} preferredEquipment - Preferred equipment type
   * @returns {Array} - Matched exercises with complete details
   */
  matchExercises(recommendedNames, allExercises, preferredEquipment = 'body weight') {
    const matchedExercises = [];
    
    // For each AI recommended exercise name
    for (const name of recommendedNames) {
      // Find matching exercises (case insensitive)
      let matches = allExercises.filter(ex => 
        ex.name && ex.name.toLowerCase().includes(name.toLowerCase())
      );
      
      // First try to find matches with the preferred equipment
      const preferredMatches = matches.filter(ex => 
        ex.equipment && ex.equipment.toLowerCase() === preferredEquipment.toLowerCase()
      );
      
      // Use preferred equipment matches if available, otherwise all matches
      const finalMatches = preferredMatches.length > 0 ? preferredMatches : matches;
      
      // Add the first match or best match
      if (finalMatches.length > 0) {
        // Sort matches by closest name length to improve quality of matches
        finalMatches.sort((a, b) => 
          Math.abs(a.name.length - name.length) - Math.abs(b.name.length - name.length)
        );
        
        matchedExercises.push(finalMatches[0]);
      }
    }
    
    // If we couldn't match enough exercises, add some popular ones for the preferred equipment
    if (matchedExercises.length < 5 && allExercises.length > 0) {
      console.log(`Could only match ${matchedExercises.length} exercises, adding some popular ones`);
      
      // Get exercises that use the preferred equipment
      const equipmentExercises = allExercises.filter(ex => 
        ex.equipment && ex.equipment.toLowerCase() === preferredEquipment.toLowerCase() &&
        !matchedExercises.some(match => match.id === ex.id)
      );
      
      // If we have equipment-specific exercises, use those, otherwise fall back to any exercises
      const additionalExercises = equipmentExercises.length > 0 
        ? equipmentExercises.slice(0, 10 - matchedExercises.length)
        : allExercises
            .filter(ex => !matchedExercises.some(match => match.id === ex.id))
            .slice(0, 10 - matchedExercises.length);
      
      matchedExercises.push(...additionalExercises);
    }
    
    return matchedExercises;
  }

  /**
   * Save the recommendation to user history
   * @param {String} userId - User ID
   * @param {Object} criteria - User criteria used for recommendation
   * @param {Array} exercises - Recommended exercises
   */
  async saveRecommendationToHistory(userId, criteria, exercises) {
    try {
      // Create a simplified version of the exercises to save
      const simplifiedExercises = exercises.map(ex => ({
        id: ex.id,
        name: ex.name,
        bodyPart: ex.bodyPart,
        equipment: ex.equipment
      }));
      
      const recommendation = {
        timestamp: new Date(),
        criteria,
        exercises: simplifiedExercises
      };
      
      let history = [];
      
      // Try to read existing history
      try {
        const historyData = await fs.readFile(this.recommendationHistoryPath, 'utf-8');
        history = JSON.parse(historyData);
      } catch (error) {
        // History file doesn't exist yet, start with an empty array
      }
      
      // Find the user's history entry
      const userIndex = history.findIndex(entry => entry.userId === userId);
      
      if (userIndex >= 0) {
        // User already has a history entry
        history[userIndex].recommendations.push(recommendation);
      } else {
        // Create a new history entry for this user
        history.push({
          userId,
          recommendations: [recommendation]
        });
      }
      
      // Save updated history
      await fs.writeFile(
        this.recommendationHistoryPath,
        JSON.stringify(history, null, 2)
      );
      
    } catch (error) {
      console.error('Error saving recommendation to history:', error);
      // Don't throw an error here, as this is a non-critical operation
    }
  }
}

export default new RecommendationService();