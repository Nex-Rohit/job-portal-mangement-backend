import jwt from 'jsonwebtoken';
import { sendError } from '../utils/errorHandler.js';
import sendSuccess from '../utils/responseHandler.js';
import asyncHandler from '../utils/asyncHandler.js';


const jwtVerifyMiddleware = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return sendError(res, 401, 'Unauthorized: No token provided');
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return sendError(res, 401, 'Unauthorized: Invalid token');
    }
});

export default jwtVerifyMiddleware;