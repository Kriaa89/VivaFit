import admin from '../config/firebase.config.js';
import asyncHandler from 'express-async-handler';
import User from '../models/user.model.js';

// Middleware to verify Firebase token
export const verifyToken = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401);
    throw new Error('Unauthorized - No token provided');
  }
  const token = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      emailVerified: decodedToken.email_verified
    };
    next();
  } catch (firebaseError) {
    res.status(401);
    throw new Error('Invalid or expired authentication token');
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