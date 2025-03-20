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

        let user = await User.findOne({ firebaseUID: uid });
        
        if (!user) {
            // Get user details from Firebase to create a basic record
            try {
                const firebaseUser = await admin.auth().getUser(uid);
                const displayName = firebaseUser.displayName || '';
                
                // Split display name into first and last name if available
                let firstName = 'User';
                let lastName = '';
                
                if (displayName) {
                    const nameParts = displayName.split(' ');
                    firstName = nameParts[0];
                    lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
                }
                
                // Create a new user with minimal required fields
                user = await User.create({
                    firebaseUID: uid,
                    email: email,
                    firstName: firstName,
                    lastName: lastName || 'User',
                    // Generate a random password since it's required by the model
                    password: Math.random().toString(36).slice(-10) + Math.random().toString(36).slice(-10)
                });
                
                console.log(`Created new user in database for Firebase user: ${uid}`);
            } catch (err) {
                console.error('Error creating user from Firebase data:', err);
                return res.status(404).json({
                    success: false,
                    message: 'User not found and could not be created automatically'
                });
            }
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