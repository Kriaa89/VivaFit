import asyncHandler from 'express-async-handler';
import exerciseService from '../service/exercise.service.js';

// Cache for expensive API calls
const cache = {
  exercises: { data: null, timestamp: null },
  bodyParts: { data: null, timestamp: null },
  equipment: { data: null, timestamp: null },
  muscles: { data: null, timestamp: null }
};

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

const isCacheValid = (cacheEntry) => {
  return cacheEntry.data && cacheEntry.timestamp && 
         (Date.now() - cacheEntry.timestamp) < CACHE_DURATION;
};

export const getAllExercises = asyncHandler(async (req, res) => {
  if (!isCacheValid(cache.exercises)) {
    const exercises = await exerciseService.getExercises();
    if (exercises && exercises.length > 0) {
      cache.exercises = {
        data: exercises,
        timestamp: Date.now()
      };
    }
  }

  if (!cache.exercises.data) {
    res.status(503);
    throw new Error('Exercise data temporarily unavailable');
  }

  res.json({
    success: true,
    data: cache.exercises.data
  });
});

export const getExerciseById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  if (!id) {
    res.status(400);
    throw new Error('Exercise ID is required');
  }

  const exercise = await exerciseService.getExerciseById(id);
  
  if (!exercise) {
    res.status(404);
    throw new Error('Exercise not found');
  }

  res.json({
    success: true,
    data: exercise
  });
});

export const getBodyParts = asyncHandler(async (req, res) => {
  if (!isCacheValid(cache.bodyParts)) {
    const exercises = cache.exercises.data || await exerciseService.getExercises();
    if (exercises && exercises.length > 0) {
      const uniqueBodyParts = [...new Set(exercises.map(ex => ex.bodyPart))]
        .filter(Boolean)
        .map(name => ({ name }));
      
      cache.bodyParts = {
        data: uniqueBodyParts,
        timestamp: Date.now()
      };
    }
  }

  if (!cache.bodyParts.data) {
    res.status(503);
    throw new Error('Body part data temporarily unavailable');
  }

  res.json({
    success: true,
    data: cache.bodyParts.data
  });
});

export const getEquipment = asyncHandler(async (req, res) => {
  if (!isCacheValid(cache.equipment)) {
    const exercises = cache.exercises.data || await exerciseService.getExercises();
    if (exercises && exercises.length > 0) {
      const uniqueEquipment = [...new Set(exercises.map(ex => ex.equipment))]
        .filter(Boolean)
        .map(name => ({ name }));
      
      cache.equipment = {
        data: uniqueEquipment,
        timestamp: Date.now()
      };
    }
  }

  if (!cache.equipment.data) {
    res.status(503);
    throw new Error('Equipment data temporarily unavailable');
  }

  res.json({
    success: true,
    data: cache.equipment.data
  });
});

export const getMuscles = asyncHandler(async (req, res) => {
  if (!isCacheValid(cache.muscles)) {
    const exercises = cache.exercises.data || await exerciseService.getExercises();
    if (exercises && exercises.length > 0) {
      const uniqueMuscles = [...new Set(exercises.map(ex => ex.target))]
        .filter(Boolean)
        .map(name => ({ name }));
      
      cache.muscles = {
        data: uniqueMuscles,
        timestamp: Date.now()
      };
    }
  }

  if (!cache.muscles.data) {
    res.status(503);
    throw new Error('Muscle data temporarily unavailable');
  }

  res.json({
    success: true,
    data: cache.muscles.data
  });
});