import express from 'express';
import multer from 'multer';
import { createUserProfile, getUserProfile, updateUserProfile, uploadProfilePhoto } from '../controllers/user.controller.js';
import { verifyToken, checkUserExists } from '../middleware/auth.middleware.js';

const router = express.Router();

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    }
});

// Create user profile - only requires token verification
router.post('/', verifyToken, createUserProfile);

// Get user profile - requires token and user to exist in database
router.get('/profile', verifyToken, checkUserExists, getUserProfile);

// Update user profile - requires token and user to exist
router.patch('/profile', verifyToken, checkUserExists, updateUserProfile);

// Upload profile photo
router.post('/upload-photo', verifyToken, checkUserExists, upload.single('profilePhoto'), uploadProfilePhoto);

export default router;