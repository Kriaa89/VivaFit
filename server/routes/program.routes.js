import express from 'express';
import {
    createProgram,
    getUserPrograms,
    getProgramById,
    updateProgram,
    deleteProgram
} from '../controllers/program.controller.js';
import { verifyToken, checkUserExists } from '../middleware/auth.middleware.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(verifyToken);
router.use(checkUserExists);

// Routes
router.post('/', createProgram);
router.get('/', getUserPrograms);
router.get('/:id', getProgramById);
router.put('/:id', updateProgram);
router.delete('/:id', deleteProgram);

export default router;