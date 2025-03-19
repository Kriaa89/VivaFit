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
    try {
        const { firstName, lastName, email, password } = req.body;
        const { uid } = req.user;

        if (!firstName || !lastName || !email) {
            return sendResponse(res, 400, false, null, 'Missing required fields');
        }

        // Check for existing user
        let user = await User.findOne({ $or: [{ firebaseUID: uid }, { email }] });
        
        if (user) {
            // Update existing user, but don't update password if it exists
            user.firstName = firstName;
            user.lastName = lastName;
            user.firebaseUID = uid;
            if (password && !user.password) {
                user.password = password;
            }
            await user.save();
            return sendResponse(res, 200, true, { user: user.toObject() }, 'Profile updated');
        }

        // Create new user with password
        user = await User.create({ 
            firebaseUID: uid, 
            firstName, 
            lastName, 
            email,
            password: password || undefined
        });
        return sendResponse(res, 201, true, { user: user.toObject() });
    } catch (error) {
        console.error('Create profile error:', error);
        if (error.name === 'ValidationError') {
            return sendResponse(res, 400, false, null, Object.values(error.errors).map(err => err.message).join(', '));
        }
        return sendResponse(res, 500, false, null, error.message || 'Error creating profile');
    }
});

// Get user profile
export const getUserProfile = asyncHandler(async (req, res) => {
    try {
        if (!req.dbUser) {
            return sendResponse(res, 404, false, null, 'User not found');
        }

        const user = await User.findById(req.dbUser._id)
            .select('-password')
            .lean();

        if (!user) {
            return sendResponse(res, 404, false, null, 'User not found');
        }

        return sendResponse(res, 200, true, user);
    } catch (error) {
        console.error('Get profile error:', error);
        return sendResponse(res, 500, false, null, error.message || 'Error fetching profile');
    }
});

// Update user profile
export const updateUserProfile = asyncHandler(async (req, res) => {
    try {
        const user = req.dbUser;
        if (!user) {
            return sendResponse(res, 404, false, null, 'User not found');
        }

        const protectedFields = ['firebaseUID', 'email', 'password'];
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

        await user.save();
        const updatedUser = await User.findById(user._id).select('-password').lean();
        return sendResponse(res, 200, true, updatedUser, 'Profile updated successfully');
    } catch (error) {
        console.error('Update profile error:', error);
        if (error.name === 'ValidationError') {
            return sendResponse(res, 400, false, null, Object.values(error.errors).map(err => err.message).join(', '));
        }
        return sendResponse(res, 500, false, null, error.message || 'Error updating profile');
    }
});

// Upload profile photo
export const uploadProfilePhoto = asyncHandler(async (req, res) => {
    try {
        if (!req.file) {
            return sendResponse(res, 400, false, null, 'No file uploaded');
        }

        const user = req.dbUser;
        if (!user) {
            return sendResponse(res, 404, false, null, 'User not found');
        }
        
        const photoUrl = `/uploads/${req.file.filename}`;
        
        const updatedUser = await User.findByIdAndUpdate(
            user._id,
            { profilePhoto: photoUrl },
            { new: true, runValidators: true }
        ).select('-password').lean();

        if (!updatedUser) {
            return sendResponse(res, 404, false, null, 'User not found');
        }

        return sendResponse(res, 200, true, { photoUrl }, 'Profile photo uploaded successfully');
    } catch (error) {
        console.error('Photo upload error:', error);
        return sendResponse(res, 500, false, null, error.message || 'Failed to upload profile photo');
    }
});