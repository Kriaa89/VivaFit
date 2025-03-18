import admin from '../config/firebase.config.js';
import asyncHandler from 'express-async-handler';
import User from '../models/user.model.js';

// Verify Firebase token
export const verifyToken = asyncHandler(async (req, res, next) => {
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) {
    res.status(401);
    throw new Error('No authentication token provided');
  }

  try {
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
  const { uid, email } = req.user;

  if (!email) {
    res.status(400);
    throw new Error('Email is required');
  }

  const user = await User.findOne({ firebaseUID: uid });
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  req.dbUser = user;
  next();
});