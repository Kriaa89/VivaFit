import asyncHandler from 'express-async-handler';

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
    if (exercises?.length > 0) {
      cache.exercises = { data: exercises, timestamp: Date.now() };
    }
  }

  if (!cache.exercises.data) {
    res.status(503);
    throw new Error('Exercise data temporarily unavailable');
  }

  res.json({ success: true, data: cache.exercises.data });
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

  res.json({ success: true, data: exercise });
});

const getCachedList = async (cacheKey, dataExtractor) => {
  if (!isCacheValid(cache[cacheKey])) {
    const exercises = cache.exercises.data || await exerciseService.getExercises();
    if (exercises?.length > 0) {
      const uniqueItems = [...new Set(exercises.map(dataExtractor))]
        .filter(Boolean)
        .map(name => ({ name }));
      
      cache[cacheKey] = { data: uniqueItems, timestamp: Date.now() };
    }
  }

  if (!cache[cacheKey].data) {
    throw new Error(`${cacheKey} data temporarily unavailable`);
  }

  return cache[cacheKey].data;
};

export const getBodyParts = asyncHandler(async (req, res) => {
  try {
    const data = await getCachedList('bodyParts', ex => ex.bodyPart);
    res.json({ success: true, data });
  } catch (error) {
    res.status(503);
    throw error;
  }
});

export const getEquipment = asyncHandler(async (req, res) => {
  try {
    const data = await getCachedList('equipment', ex => ex.equipment);
    res.json({ success: true, data });
  } catch (error) {
    res.status(503);
    throw error;
  }
});

export const getMuscles = asyncHandler(async (req, res) => {
  try {
    const data = await getCachedList('muscles', ex => ex.target);
    res.json({ success: true, data });
  } catch (error) {
    res.status(503);
    throw error;
  }
});