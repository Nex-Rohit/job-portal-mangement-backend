# JOB-PORTAL-MANAGEMENT

A comprehensive backend system for managing job applications, user profiles, and job postings with role-based access control.

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Authentication](#authentication)
- [API Documentation](#api-documentation)
  - [User Routes](#user-routes)
  - [Admin Routes](#admin-routes)
- [Error Handling](#error-handling)
- [Installation & Setup](#installation--setup)

---

## Project Overview

This job portal management system provides APIs for:
- User registration and authentication
- Profile management with photo and resume uploads
- Education details management
- Job applications and tracking
- Admin controls for job postings

---

## Tech Stack

- **Backend**: Node.js with Express.js
- **Database**: Prisma ORM with Database
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Cloudinary
- **Form Data**: Multer
- **Security**: Bcrypt for password hashing

---

## Project Structure

```
src/
├── app.js                 # Express app configuration
├── server.js              # Server entry point
├── controller/            # Route controllers
│   ├── userController.js
│   └── adminController.js
├── routes/                # Route definitions
│   ├── userRoutes.js
│   └── adminRoutes.js
├── middleware/            # Custom middleware
│   ├── authorize.js       # Role-based authorization
│   ├── errorMiddleware.js
│   └── jwtVerifyMiddleware.js
├── db/                    # Database configuration
│   └── db.js
└── utils/                 # Utility functions
    ├── asyncHandler.js
    ├── errorHandler.js
    ├── responseHandler.js
    ├── jwtSign.js
    ├── cloudinaryUpload.js
    └── multer.js
```

---

## Authentication

The API uses **JWT (JSON Web Tokens)** for authentication:

- Tokens are issued upon successful login/registration
- Token expiration: **24 hours**
- Tokens must be sent in the `Authorization` header as `Bearer <token>`
- Protected routes require valid JWT and appropriate role authorization

---

## API Documentation

### User Routes

All user routes are prefixed with `/api/user`

---

#### 1. **User Sign-Up / Registration**

Create a new user account.

| Property | Value |
|----------|-------|
| **Endpoint** | `/sign-up` |
| **Method** | `POST` |
| **Authentication** | Not required |
| **Authorization** | Not required |

**Request Body:**

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "securePassword123",
  "role": "user"
}
```

**Request Parameters:**

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `firstName` | string | Yes | - |
| `lastName` | string | Yes | - |
| `email` | string | Yes | Must be valid email format |
| `password` | string | Yes | Minimum 8 characters |
| `role` | string | Yes | Must be "user" |

**Success Response (201):**

```json
{
  "success": true,
  "statusCode": 201,
  "message": "User Created Successfully",
  "data": [
    {
      "id": "user-uuid",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "role": "user",
      "createdAt": "2026-04-22T10:00:00Z",
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  ]
}
```

**Error Responses:**

| Status | Error Message | Reason | Details |
|--------|---------------|--------|---------|
| 400 | Validation Error | Missing/Invalid fields | `{ "firstName": "First name is required", "email": "Invalid email format", "password": "Password must be at least 8 characters", ... }` |
| 409 | User already exists with this email | Duplicate email | `{ "reason": "Database error" }` |

---

#### 2. **User Login**

Authenticate user with email and password.

| Property | Value |
|----------|-------|
| **Endpoint** | `/login` |
| **Method** | `POST` |
| **Authentication** | Not required |
| **Authorization** | Not required |

**Request Body:**

```json
{
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

**Request Parameters:**

| Field | Type | Required |
|-------|------|----------|
| `email` | string | Yes |
| `password` | string | Yes |

**Success Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Login successful",
  "data": {
    "id": "user-uuid",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "role": "user",
    "createdAt": "2026-04-22T10:00:00Z",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**

| Status | Error Message | Reason | Details |
|--------|---------------|--------|---------|
| 400 | Validation Error | Missing fields | `{ "email": "Email is required", "password": "Password is required" }` |
| 404 | User not found with this email | User doesn't exist | `{ "reason": "Database error" }` |
| 401 | Invalid password | Wrong password | `{ "reason": "Authentication error" }` |

---

#### 3. **Get User Profile**

Retrieve authenticated user's profile details.

| Property | Value |
|----------|-------|
| **Endpoint** | `/profile` |
| **Method** | `GET` |
| **Authentication** | Required (JWT) |
| **Authorization** | Required (role: "user") |

**Request Headers:**

```
Authorization: Bearer <jwt_token>
```

**Query Parameters:** None

**Request Body:** Not applicable

**Success Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "User details retrieved successfully",
  "data": [
    {
      "profilePhoto": "https://cloudinary.url/profile.jpg",
      "resumeLink": "https://cloudinary.url/resume.pdf",
      "appliedCount": 5,
      "selectedCount": 2,
      "rejectedCount": 1,
      "createdAt": "2026-04-22T10:00:00Z",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com"
    }
  ]
}
```

**Error Responses:**

| Status | Error Message | Reason | Details |
|--------|---------------|--------|---------|
| 401 | Unauthorized access | Missing/Invalid JWT token | `{ "reason": "Authentication error" }` |
| 403 | Forbidden access | Insufficient role permissions | `{ "reason": "Authorization error" }` |
| 404 | User details not found | No profile created yet | `{ "reason": "Database error" }` |

---

#### 4. **Update User Profile**

Update user profile including photo and resume uploads.

| Property | Value |
|----------|-------|
| **Endpoint** | `/profile` |
| **Method** | `PATCH` |
| **Authentication** | Required (JWT) |
| **Authorization** | Required (role: "user") |
| **Content-Type** | `multipart/form-data` |

**Request Headers:**

```
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data
```

**Request Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `profilePhoto` | file | No | User profile photo (image file) |
| `resume` | file | No | User resume (PDF or document) |

**Example cURL:**

```bash
curl -X PATCH http://localhost:3000/api/user/profile \
  -H "Authorization: Bearer <jwt_token>" \
  -F "profilePhoto=@/path/to/photo.jpg" \
  -F "resume=@/path/to/resume.pdf"
```

**Success Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Profile updated successfully",
  "data": [
    {
      "profilePhoto": "https://cloudinary.url/profile.jpg",
      "resumeLink": "https://cloudinary.url/resume.pdf",
      "appliedCount": 5,
      "selectedCount": 2,
      "rejectedCount": 1,
      "createdAt": "2026-04-22T10:00:00Z",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com"
    }
  ]
}
```

**Error Responses:**

| Status | Error Message | Reason | Details |
|--------|---------------|--------|---------|
| 400 | Nothing to update | No files provided | `{ "reason": "Send profilePhoto or resume file" }` |
| 401 | Unauthorized access | Missing/Invalid JWT token | `{ "reason": "Authentication error" }` |
| 403 | Forbidden access | Insufficient role permissions | `{ "reason": "Authorization error" }` |

---

#### 5. **Add Education Details**

Add or update user's education information.

| Property | Value |
|----------|-------|
| **Endpoint** | `/education` |
| **Method** | `POST` |
| **Authentication** | Required (JWT) |
| **Authorization** | Required (role: "user") |

**Request Headers:**

```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "graduationClg": "ABC University",
  "graduationPerc": "85.5",
  "postGradClg": "XYZ Institute",
  "postGradPerc": "88.0",
  "intermediateSchool": "Senior Secondary School",
  "intermediatePerc": "92.0"
}
```

**Request Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `graduationClg` | string | No | Graduation college name |
| `graduationPerc` | string/number | No | Graduation percentage |
| `postGradClg` | string | No | Post-graduation college name |
| `postGradPerc` | string/number | No | Post-graduation percentage |
| `intermediateSchool` | string | No | Intermediate school name |
| `intermediatePerc` | string/number | No | Intermediate percentage |

**Success Response (201):**

```json
{
  "success": true,
  "statusCode": 201,
  "message": "Education details added successfully",
  "data": [
    {
      "graduationClg": "ABC University",
      "graduationPerc": "85.5",
      "postGradClg": "XYZ Institute",
      "postGradPerc": "88.0",
      "intermediateSchool": "Senior Secondary School",
      "intermediatePerc": "92.0",
      "createdAt": "2026-04-22T10:00:00Z",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com"
    }
  ]
}
```

**Error Responses:**

| Status | Error Message | Reason | Details |
|--------|---------------|--------|---------|
| 401 | Unauthorized access | Missing/Invalid JWT token | `{ "reason": "Authentication error" }` |
| 403 | Forbidden access | Insufficient role permissions | `{ "reason": "Authorization error" }` |

---

#### 6. **Get Education Details**

Retrieve user's education information.

| Property | Value |
|----------|-------|
| **Endpoint** | `/education` |
| **Method** | `GET` |
| **Authentication** | Required (JWT) |
| **Authorization** | Required (role: "user") |

**Request Headers:**

```
Authorization: Bearer <jwt_token>
```

**Query Parameters:** None

**Request Body:** Not applicable

**Success Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Education details retrieved successfully",
  "data": [
    {
      "graduationClg": "ABC University",
      "graduationPerc": "85.5",
      "postGradClg": "XYZ Institute",
      "postGradPerc": "88.0",
      "intermediateSchool": "Senior Secondary School",
      "intermediatePerc": "92.0",
      "createdAt": "2026-04-22T10:00:00Z",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com"
    }
  ]
}
```

**Error Responses:**

| Status | Error Message | Reason | Details |
|--------|---------------|--------|---------|
| 401 | Unauthorized access | Missing/Invalid JWT token | `{ "reason": "Authentication error" }` |
| 403 | Forbidden access | Insufficient role permissions | `{ "reason": "Authorization error" }` |

---

## Error Handling

The API follows a consistent error response format:

**General Error Response:**

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Error message",
  "errors": {
    "reason": "Error reason"
  }
}
```

**Validation Error Response:**

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation Error",
  "errors": {
    "fieldName": "Error message for this field",
    "anotherField": "Error message for another field"
  }
}
```

**Common HTTP Status Codes:**

| Status | Meaning |
|--------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid input or validation error |
| 401 | Unauthorized - Missing or invalid authentication |
| 403 | Forbidden - Insufficient permissions for role |
| 404 | Not Found - Resource doesn't exist |
| 409 | Conflict - Resource already exists (e.g., duplicate email) |

---

## Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Database (configured with Prisma)
- Cloudinary account for file uploads

### Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd job-portal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the root directory:
   ```
   DATABASE_URL=your_database_url
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

4. **Run database migrations**
   ```bash
   npx prisma migrate dev
   ```

5. **Generate Prisma Client**
   ```bash
   npx prisma generate
   ```

6. **Start the server**
   ```bash
   npm start
   ```

The API will be available at `http://localhost:3000` (or your configured port)

---

## Future Enhancements

- Admin routes for job management
- Application tracking and status updates
- Email notifications
- Advanced search and filtering
- Pagination for large datasets