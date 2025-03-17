// Simple error handler for consistent error responses
export const errorHandler = (err, req, res, next) => {
  // Set status code, default to 500 if not set
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  // Basic error response structure
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};