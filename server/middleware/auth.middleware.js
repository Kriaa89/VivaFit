import admin from '../config/firebase.config.js';
import asyncHandler from 'express-async-handler';
import User from '../models/user.model.js';

// Middleware to verify Firebase token
export const verifyToken = asyncHandler(async (req, res, next) => {
  try {
    // Get the token from the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('No Bearer token found in Authorization header');
      res.status(401);
      throw new Error('Unauthorized - No token provided');
    }

    const token = authHeader.split('Bearer ')[1];
    
    // Log token without exposing sensitive data
    console.log('Attempting to verify token (first 10 chars):', token.substring(0, 10) + '...');
    
    try {
      // Verify the token with Firebase Admin SDK
      const decodedToken = await admin.auth().verifyIdToken(token);
      
      console.log('Token verified successfully for user:', decodedToken.email);
      
      // Add the user information to the request object
      req.user = {
        uid: decodedToken.uid,
        email: decodedToken.email,
        emailVerified: decodedToken.email_verified
      };
      
      next();
    } catch (firebaseError) {
      console.error('Firebase token verification failed:', firebaseError);
      res.status(401).json({
        success: false,
        message: 'Invalid or expired authentication token',
        error: firebaseError.message
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({
      success: false,
      message: 'Authentication failed',
      error: error.message
    });
  }
});

// Middleware to check if user exists in your database
export const checkUserExists = asyncHandler(async (req, res, next) => {
  try {
    const { uid } = req.user;
    
    // Check if user exists in your MongoDB
    const user = await User.findOne({ firebaseUID: uid });
    
    if (!user) {
      res.status(404);
      throw new Error('User not found in database');
    }
    
    // Add user data to request
    req.dbUser = user;
    next();
  } catch (error) {
    console.error('User check middleware error:', error);
    res.status(error.statusCode || 500);
    throw error;
  }
});