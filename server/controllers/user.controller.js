import User from '../models/user.model.js';
import asyncHandler from 'express-async-handler';

// Helper for consistent response format
const sendResponse = (res, status, success, data = null, message = null) => {
    const response = { success };
    if (data) response.data = data;
    if (message) response.message = message;
    res.status(status).json(response);
};

// Create user profile
export const createUserProfile = asyncHandler(async (req, res) => {
    const { firstName, lastName, email } = req.body;
    const { uid } = req.user;

    if (!firstName || !lastName || !email) {
        return sendResponse(res, 400, false, null, 'Missing required fields');
    }

    // Check for existing user
    let user = await User.findOne({ $or: [{ firebaseUID: uid }, { email }] });
    
    if (user) {
        // Update existing user
        user.firstName = firstName;
        user.lastName = lastName;
        user.firebaseUID = uid;
        await user.save();
        return sendResponse(res, 200, true, user, 'Profile updated');
    }

    // Create new user
    user = await User.create({ firebaseUID: uid, firstName, lastName, email });
    sendResponse(res, 201, true, user);
});

// Get user profile
export const getUserProfile = asyncHandler(async (req, res) => {
    sendResponse(res, 200, true, req.dbUser);
});

// Update user profile
export const updateUserProfile = asyncHandler(async (req, res) => {
    const user = req.dbUser;
    if (!user) {
        return sendResponse(res, 404, false, null, 'User not found');
    }

    const protectedFields = ['firebaseUID', 'email'];
    const updates = {};
    
    // Validate and collect updates
    Object.keys(req.body).forEach(key => {
        if (!protectedFields.includes(key)) {
            updates[key] = req.body[key];
        }
    });

    // Update user fields
    Object.assign(user, updates);

    // Validate required fields if they're being updated
    if (updates.age && (isNaN(updates.age) || updates.age <= 0 || updates.age > 120)) {
        return sendResponse(res, 400, false, null, 'Invalid age value');
    }
    if (updates.weight && (isNaN(updates.weight) || updates.weight <= 0)) {
        return sendResponse(res, 400, false, null, 'Invalid weight value');
    }
    if (updates.height && (isNaN(updates.height) || updates.height <= 0)) {
        return sendResponse(res, 400, false, null, 'Invalid height value');
    }

    try {
        await user.save();
        sendResponse(res, 200, true, user, 'Profile updated successfully');
    } catch (error) {
        if (error.name === 'ValidationError') {
            return sendResponse(res, 400, false, null, Object.values(error.errors).map(err => err.message).join(', '));
        }
        throw error;
    }
});