import express from 'express';
import { createUserProfile, getUserProfile, updateUserProfile } from '../controllers/user.controller.js';
import { verifyToken, checkUserExists } from '../middleware/auth.middleware.js';

const router = express.Router();

// Create user profile - only requires token verification
router.post('/', verifyToken, createUserProfile);

// Get user profile - requires token and user to exist in database
router.get('/profile', verifyToken, checkUserExists, getUserProfile);

// Update user profile - requires token and user to exist
router.patch('/profile', verifyToken, checkUserExists, updateUserProfile);

export default router;