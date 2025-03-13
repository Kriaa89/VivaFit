import User from '../models/user.model.js';
import asyncHandler from 'express-async-handler';
import admin from '../config/firebase.config.js';

// Create user profile
export const createUserProfile = asyncHandler(async (req, res) => {
    const { firstName, lastName, email } = req.body;
    const { uid } = req.user;

    // Check if user already exists in database
    const existingUser = await User.findOne({ firebaseUID: uid });
    
    if (existingUser) {
        res.status(400);
        throw new Error('User already exists');
    }

    // Create new user in your database
    const newUser = await User.create({
        firebaseUID: uid,
        firstName,
        lastName,
        email
    });

    res.status(201).json({
        success: true,
        data: {
            id: newUser._id,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email
        }
    });
});

// Get user profile
export const getUserProfile = asyncHandler(async (req, res) => {
    const user = req.dbUser;
    
    res.status(200).json({
        success: true,
        data: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            age: user.age,
            height: user.height,
            weight: user.weight,
            fitnessLevel: user.fitnessLevel,
            fitnessGoal: user.fitnessGoal,
            // Include other fields as needed
        }
    });
});

// Update user profile
export const updateUserProfile = asyncHandler(async (req, res) => {
    const user = req.dbUser;
    
    // Update fields from request body
    Object.keys(req.body).forEach(key => {
        if (key !== 'firebaseUID' && key !== 'email') { // Protect important fields
            user[key] = req.body[key];
        }
    });

    // Save updated user
    await user.save();

    res.status(200).json({
        success: true,
        data: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            // Return updated fields
            ...req.body
        }
    });
});