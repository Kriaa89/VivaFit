import express from 'express';
import { verifyToken } from '../middleware/auth.middleware.js';
import { getAllExercises, getExerciseById, getBodyParts, getEquipment, getMuscles } from '../controllers/exercise.controller.js';

const router = express.Router();

// Apply authentication middleware
router.use(verifyToken);

// Exercise routes
router.get('/', getAllExercises);
router.get('/:id', getExerciseById);
router.get('/bodyparts/list', getBodyParts);
router.get('/equipment/list', getEquipment);
router.get('/muscles/list', getMuscles);

export default router;