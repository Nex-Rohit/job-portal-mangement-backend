# Response and Error Handler Guide

## Overview
This API uses a **structured response system** for both success and error responses to ensure consistency across all endpoints.

## Response Handlers

### 1. Success Response (`sendSuccess`)
For successful API calls with optional data.

**Usage:**
```javascript
import { sendSuccess } from '../utils/responseHandler.js';

export const getUser = async (req, res, next) => {
  try {
    const user = { id: 1, name: 'John' };
    return sendSuccess(res, 200, 'User retrieved successfully', user);
  } catch (error) {
    next(error);
  }
};
```

**Response Format:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "User retrieved successfully",
  "data": {
    "id": 1,
    "name": "John"
  },
  "timestamp": "2026-04-21T10:30:00.000Z"
}
```



## Error Handlers

### 1. Custom Error Class (`AppError`)
Throw custom errors with status codes.

**Usage:**
```javascript
import { AppError } from '../utils/errorHandler.js';

export const getUser = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.params.id } });
    
    if (!user) {
      throw new AppError('User not found', 404);
    }
    
    return sendSuccess(res, 200, 'User retrieved', user);
  } catch (error) {
    next(error);
  }
};
```

### 2. Error Handler Function (`sendError`)
For manual error responses.

**Usage:**
```javascript
import { sendError } from '../utils/errorHandler.js';

export const updateUser = async (req, res, next) => {
  try {
    // Your logic here
    return sendError(res, 500, 'Update failed', { reason: 'Database error' });
  } catch (error) {
    next(error);
  }
};
```

**Response Format:**
```json
{
  "success": false,
  "statusCode": 500,
  "message": "Update failed",
  "errors": {
    "reason": "Database error"
  },
  "timestamp": "2026-04-21T10:30:00.000Z"
}
```

### 3. Validation Error Handler (`sendValidationError`)
For form/input validation errors.

**Usage:**
```javascript
import { sendValidationError } from '../utils/errorHandler.js';

export const createUser = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const errors = {};

    if (!name) errors.name = 'Name is required';
    if (!email) errors.email = 'Email is required';
    if (email && !email.includes('@')) errors.email = 'Invalid email format';

    if (Object.keys(errors).length > 0) {
      return sendValidationError(res, errors);
    }

    // Create user logic...
    return sendSuccess(res, 201, 'User created successfully', newUser);
  } catch (error) {
    next(error);
  }
};
```

**Response Format:**
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation Error",
  "errors": {
    "name": "Name is required",
    "email": "Invalid email format"
  },
  "timestamp": "2026-04-21T10:30:00.000Z"
}
```

---

## Error Middleware

The error middleware automatically handles:

### Prisma Errors
- **P2002** (Unique constraint) → 409 Conflict
- **P2025** (Record not found) → 404 Not Found
- Other Prisma errors → 400 Bad Request

### JWT Errors
- **JsonWebTokenError** → 401 Unauthorized
- **TokenExpiredError** → 401 Unauthorized

### Validation Errors
- Automatically captured from validators

---

## Best Practices

1. **Always use try-catch** in controllers
2. **Pass errors to middleware** using `next(error)`
3. **Throw AppError** for custom errors with status codes
4. **Use validation errors** for form validation
5. **Use asyncHandler** (optional) to auto-catch async errors:

```javascript
import asyncHandler from '../utils/asyncHandler.js';

export const getUser = asyncHandler(async (req, res, next) => {
  const user = await prisma.user.findUnique({ where: { id: req.params.id } });
  if (!user) throw new AppError('User not found', 404);
  return sendSuccess(res, 200, 'User retrieved', user);
});
```

---

## Summary

| Function | Purpose | Status Code |
|----------|---------|-------------|
| `sendSuccess()` | Single item response | 200/201 |
| `sendSuccessWithPagination()` | List with pagination | 200 |
| `sendError()` | Manual error response | 4xx/5xx |
| `sendValidationError()` | Validation errors | 400 |
| `AppError` | Custom error class | Any |
| `errorMiddleware` | Global error handler | Auto |
