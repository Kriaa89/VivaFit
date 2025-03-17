import admin from '../config/firebase.config.js';
import asyncHandler from 'express-async-handler';
import User from '../models/user.model.js';

// Verify Firebase token
export const verifyToken = asyncHandler(async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];
    if (!token) {
      res.status(401);
      throw new Error('No authentication token provided');
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      emailVerified: decodedToken.email_verified
    };
    next();
  } catch (error) {
    res.status(401);
    throw new Error('Invalid authentication token');
  }
});

// Check if user exists in database
export const checkUserExists = asyncHandler(async (req, res, next) => {
  try {
    const { uid, email } = req.user;

    if (!email) {
      res.status(400);
      throw new Error('Email is required');
    }

    // Find or create user
    let user = await User.findOne({ 
      $or: [{ firebaseUID: uid }, { email }] 
    });

    if (!user) {
      // Create basic user profile
      user = await User.create({
        firebaseUID: uid,
        firstName: 'User',
        lastName: '',
        email
      });
    } else if (user.firebaseUID !== uid) {
      // Update Firebase UID if email exists but UID doesn't match
      user.firebaseUID = uid;
      await user.save();
    }

    req.dbUser = user;
    next();
  } catch (error) {
    res.status(500);
    throw error;
  }
});