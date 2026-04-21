import { sendError } from '../utils/errorHandler.js';

/**
 * Global Error Handler Middleware
 * Catches all errors and sends structured error responses
 */
const errorMiddleware = (err, req, res, next) => {
  // Default error values
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errors = null;

  // Handle Prisma errors
  if (err.code === 'P2002') {
    statusCode = 409;
    message = 'Unique constraint failed';
    errors = {
      field: err.meta?.target?.[0] || 'unknown',
      message: `This ${err.meta?.target?.[0]} is already in use`,
    };
  } else if (err.code === 'P2025') {
    statusCode = 404;
    message = 'Record not found';
  } else if (err.code?.startsWith('P')) {
    statusCode = 400;
    message = 'Database error occurred';
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token has expired';
  }

  // Handle validation errors (e.g., from express-validator)
  if (err.array && typeof err.array === 'function') {
    statusCode = 400;
    message = 'Validation failed';
    errors = err.array();
  }

  // Log error in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', {
      message: err.message,
      statusCode,
      stack: err.stack,
    });
  }

  // Send error response
  return sendError(res, statusCode, message, errors);
};

export default errorMiddleware;
