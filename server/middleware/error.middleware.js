// Error middleware for handling errors
export const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            success: false,
            message: Object.values(err.errors).map(e => e.message).join(', ')
        });
    }

    // Mongoose duplicate key error
    if (err.code === 11000) {
        return res.status(400).json({
            success: false,
            message: 'Duplicate field value entered'
        });
    }

    // Firebase auth error
    if (err.code && err.code.startsWith('auth/')) {
        return res.status(401).json({
            success: false,
            message: err.message
        });
    }

    // Default error
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error'
    });
};