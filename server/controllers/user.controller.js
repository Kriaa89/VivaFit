import User from '../models/user.model.js';
import asyncHandler from 'express-async-handler';
import admin from '../config/firebase.config.js';

// Create user profile
export const createUserProfile = asyncHandler(async (req, res) => {
    const { firstName, lastName, email } = req.body;
    const { uid } = req.user;

    try {
        // Check if user already exists in database
        const existingUser = await User.findOne({ firebaseUID: uid });
        
        if (existingUser) {
            return res.status(200).json({
                success: true,
                message: 'User already exists',
                data: {
                    id: existingUser._id,
                    firstName: existingUser.firstName,
                    lastName: existingUser.lastName,
                    email: existingUser.email
                }
            });
        }

        // Create new user in your database
        const newUser = await User.create({
            firebaseUID: uid,
            firstName: firstName || "User", // Fallback for Google users
            lastName: lastName || "",
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
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to create user profile',
            error: error.message
        });
    }
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
            email: user.email,
            // Return updated fields
            ...req.body
        }
    });
});