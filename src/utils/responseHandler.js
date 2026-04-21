/**
 * Success Response Handler
 * Sends a consistent structured response for successful API calls
 */
const sendSuccess = (res, statusCode = 200, message = 'Success', data = null) => {
  const response = {
    success: true,
    statusCode,
    message,
    ...(data && { data }),
    timestamp: new Date().toISOString(),
  };

  return res.status(statusCode).json(response);
};


export default sendSuccess ;
