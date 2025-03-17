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
    console.error('Firebase token verification error:', firebaseError);
    res.status(401);
    throw new Error('Invalid or expired authentication token');
  }
});

// Middleware to check if user exists in your database
export const checkUserExists = asyncHandler(async (req, res, next) => {
  try {
    const { uid, email } = req.user;
    
    // Check if user exists in your MongoDB by Firebase UID
    let user = await User.findOne({ firebaseUID: uid });
    
    if (!user && email) {
      // If no user found by UID but we have an email, try finding by email
      user = await User.findOne({ email: email });
      
      if (user) {
        // If found by email but firebaseUID doesn't match, update it
        if (user.firebaseUID !== uid) {
          user.firebaseUID = uid;
          await user.save();
        }
      }
    }
    
    // If still no user found, try to create one
    if (!user) {
      try {
        // Get user details from Firebase
        const firebaseUser = await admin.auth().getUser(uid);
        
        // Extract names from Firebase display name or use defaults
        let firstName = "User";
        let lastName = "";
        
        if (firebaseUser.displayName) {
          const nameParts = firebaseUser.displayName.split(' ');
          firstName = nameParts[0] || "User";
          lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : "";
        }
        
        // Use email from token if available, otherwise from Firebase user
        const userEmail = email || firebaseUser.email;
        
        // Validate that we have an email
        if (!userEmail) {
          res.status(400);
          throw new Error('Email is required to create a user profile');
        }
        
        // Create new user in MongoDB with retry logic
        try {
          user = new User({
            firebaseUID: uid,
            firstName: firstName,
            lastName: lastName,
            email: userEmail
          });
          
          await user.save();
        } catch (saveError) {
          // Check if it's a duplicate key error
          if (saveError.code === 11000) {
            // If duplicate error is on email field
            if (saveError.keyPattern && saveError.keyPattern.email) {
              // Find the existing user with this email and update their firebaseUID
              const existingUser = await User.findOne({ email: userEmail });
              if (existingUser) {
                existingUser.firebaseUID = uid;
                await existingUser.save();
                user = existingUser;
              } else {
                throw saveError;
              }
            } else {
              throw saveError;
            }
          } else {
            throw saveError;
          }
        }
      } catch (createError) {
        // Last resort - try with minimal profile
        if (email) {
          try {
            user = await User.create({
              firebaseUID: uid,
              firstName: "User", // Default name
              lastName: "",
              email: email
            });
          } catch (fallbackError) {
            res.status(500);
            throw new Error('User not found in database and auto-creation failed');
          }
        } else {
          res.status(404);
          throw new Error('User not found in database and auto-creation failed. No email available.');
        }
      }
    }
    
    // Add user data to request
    req.dbUser = user;
    next();
  } catch (error) {
    res.status(error.statusCode || 500);
    throw error;
  }
});