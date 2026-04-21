/**
 * Custom Error Class for API Errors
 */
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.timestamp = new Date().toISOString();

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Error Response Handler
 * Sends a consistent structured error response
 */
const sendError = (res, statusCode = 500, message = 'Internal Server Error', errors = null) => {
  const response = {
    success: false,
    statusCode,
    message,
    ...(errors && { errors }),
    timestamp: new Date().toISOString(),
  };

  return res.status(statusCode).json(response);
};

/**
 * Validation Error Handler
 * Sends structured validation errors
 */
const sendValidationError = (res, validationErrors = {}, statusCode = 400) => {
  const response = {
    success: false,
    statusCode,
    message: 'Validation Error',
    errors: validationErrors,
    timestamp: new Date().toISOString(),
  };

  return res.status(statusCode).json(response);
};

export { AppError, sendError, sendValidationError };
