import admin from '../config/firebase.config.js';
import asyncHandler from 'express-async-handler';

// Middleware to verify Firebase token
export const verifyToken = asyncHandler(async (req, res, next) => {
  try {
    // Get the token from the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401);
      throw new Error('Unauthorized - No token provided');
    }

    const token = authHeader.split('Bearer ')[1];
    
    // Verify the token with Firebase Admin SDK
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    // Add the user information to the request object
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      emailVerified: decodedToken.email_verified
    };
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401);
    throw new Error('Unauthorized - Invalid token');
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