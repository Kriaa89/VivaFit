import admin from '../config/firebase.config.js';
import asyncHandler from 'express-async-handler';
import User from '../models/user.model.js';

// Verify Firebase token
export const verifyToken = asyncHandler(async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split('Bearer ')[1];
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No authentication token provided'
            });
        }

        const decodedToken = await admin.auth().verifyIdToken(token);
        if (!decodedToken) {
            return res.status(401).json({
                success: false,
                message: 'Invalid authentication token'
            });
        }

        req.user = {
            uid: decodedToken.uid,
            email: decodedToken.email,
            emailVerified: decodedToken.email_verified
        };
        next();
    } catch (error) {
        console.error('Token verification error:', error);
        return res.status(401).json({
            success: false,
            message: error.message || 'Invalid authentication token'
        });
    }
});

// Check if user exists in database
export const checkUserExists = asyncHandler(async (req, res, next) => {
    try {
        const { uid, email } = req.user;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }

        const user = await User.findOne({ firebaseUID: uid });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        req.dbUser = user;
        next();
    } catch (error) {
        console.error('User verification error:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Error verifying user'
        });
    }
});