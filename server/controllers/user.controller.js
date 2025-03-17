import User from '../models/user.model.js';
import asyncHandler from 'express-async-handler';

// Create a new user profile
export const createUserProfile = asyncHandler(async (req, res) => {
    // Extract required fields from the request body
    const { firstName, lastName, email } = req.body;

    // Ensure the user is authenticated (set by previous middleware)
    if (!req.user) {
        return res.status(401).json({ success: false, message: 'User not authenticated' });
    }
    const { uid } = req.user;

    // Validate required fields are provided
    if (!firstName || !lastName || !email) {
        return res.status(400).json({
            success: false,
            message: 'Missing required fields: firstName, lastName, and email are required'
        });
    }

    try {
        // Check if a user with the given Firebase UID already exists
        let existingUser = await User.findOne({ firebaseUID: uid });
        
        // If a user with this Firebase UID exists, update their information
        if (existingUser) {
            // Update user information if provided
            existingUser.firstName = firstName;
            existingUser.lastName = lastName;
            // Don't update email as it's a unique field
            
            await existingUser.save();
            
            return res.status(200).json({ 
                success: true,
                message: 'User profile updated',
                data: {
                    id: existingUser._id,
                    firstName: existingUser.firstName,
                    lastName: existingUser.lastName,
                    email: existingUser.email
                }
            });
        }
        
        // Check if a user with the same email exists but different Firebase UID
        existingUser = await User.findOne({ email });
        if (existingUser) {
            // Update the Firebase UID for this user
            existingUser.firebaseUID = uid;
            existingUser.firstName = firstName;
            existingUser.lastName = lastName;
            
            await existingUser.save();
            
            return res.status(200).json({ 
                success: true,
                message: 'User profile linked with Firebase account',
                data: {
                    id: existingUser._id,
                    firstName: existingUser.firstName,
                    lastName: existingUser.lastName,
                    email: existingUser.email
                }
            });
        }

        // Create and save the new user profile in the database
        const newUser = await User.create({
            firebaseUID: uid,
            firstName,
            lastName,
            email
        });

        // Send a success response with the user's basic data
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
        
        // Handle duplicate key error specifically
        if (error.code === 11000) {
            res.status(409).json({
                success: false,
                message: 'User with this email already exists'
            });
        } else {
            res.status(500).json({
                success: false,
                message: `Error creating user profile: ${error.message}`
            });
        }
    }
});

// Retrieve the authenticated user's profile
export const getUserProfile = asyncHandler(async (req, res) => {
    // The user document is attached to req.dbUser by previous middleware
    const user = req.dbUser;

    // Send the user profile data as the response
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
            fitnessGoal: user.fitnessGoal
            // Add any additional fields as needed
        }
    });
});

// Update the authenticated user's profile
export const updateUserProfile = asyncHandler(async (req, res) => {
    // Retrieve the existing user document from req.dbUser
    const user = req.dbUser;

    // Loop through each field in the request body
    // Skip critical fields: 'firebaseUID' and 'email'
    Object.keys(req.body).forEach(key => {
        if (!['firebaseUID', 'email'].includes(key)) {
            user[key] = req.body[key];
        }
    });

    try {
        // Save the updated user to the database
        await user.save();

        // Return the updated user profile data in the response
        res.status(200).json({
            success: true,
            data: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                ...req.body // Merged updates (excluding protected fields)
            }
        });
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({
            success: false,
            message: `Error updating user profile: ${error.message}`
        });
    }
});