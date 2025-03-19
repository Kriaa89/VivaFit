import express from 'express';
import multer from 'multer';
import path from 'path';
import { createUserProfile, getUserProfile, updateUserProfile, uploadProfilePhoto } from '../controllers/user.controller.js';
import { verifyToken, checkUserExists } from '../middleware/auth.middleware.js';
import { fileURLToPath } from 'url';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, '..', 'uploads');
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        // Create unique filename with original extension
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: fileFilter
});

// Routes
router.post('/', verifyToken, createUserProfile);
router.get('/profile', verifyToken, checkUserExists, getUserProfile);
router.patch('/profile', verifyToken, checkUserExists, updateUserProfile);

// Upload profile photo with error handling
router.post('/upload-photo', verifyToken, checkUserExists, (req, res, next) => {
    upload.single('profilePhoto')(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ 
                success: false, 
                message: 'File upload error', 
                error: err.message 
            });
        } else if (err) {
            return res.status(400).json({ 
                success: false, 
                message: err.message 
            });
        }
        next();
    });
}, uploadProfilePhoto);

export default router;