import User from '../models/user.model.js';
import asyncHandler from 'express-async-handler';
import admin from '../config/firebase.config.js';

// Create user profile
export const createUserProfile = asyncHandler(async (req, res) => {
    try {
        const { firstName, lastName, email } = req.body;
        const { uid } = req.user;
        
        // Validate required fields
        if (!firstName || !lastName || !email) {
            console.error('Missing required fields:', { firstName, lastName, email });
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: firstName, lastName, and email are required'
            });
        }

        if (!uid) {
            console.error('Missing Firebase UID');
            return res.status(400).json({
                success: false,
                message: 'Firebase UID is required. Authentication failed.'
            });
        }

        // Check if user already exists in database
        const existingUser = await User.findOne({ firebaseUID: uid });
        
        if (existingUser) {
            console.log('User already exists:', existingUser.email);
            return res.status(400).json({
                success: false,
                message: 'User already exists'
            });
        }

        console.log('Creating new user with data:', { uid, firstName, lastName, email });
        
        // Create new user in your database
        const newUser = await User.create({
            firebaseUID: uid,
            firstName,
            lastName,
            email
        });

        console.log('User created successfully:', newUser._id);

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
        console.error('Error creating user profile:', error);
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