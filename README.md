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

#### 7. **Apply for a Job**

Submit a job application.

| Property | Value |
|----------|-------|
| **Endpoint** | `/apply/:jobId` |
| **Method** | `POST` |
| **Authentication** | Required (JWT) |
| **Authorization** | Required (role: "user") |

**Request Headers:**

```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**URL Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `jobId` | string | Yes | ID of the job to apply for |

**Request Body:**

```json
{}
```

**Success Response (201):**

```json
{
  "success": true,
  "statusCode": 201,
  "message": "Job application submitted successfully",
  "data": {
    "applicationId": "app-uuid",
    "jobId": "job-uuid",
    "userId": "user-uuid",
    "status": "applied",
    "appliedAt": "2026-04-23T10:00:00Z"
  }
}
```

**Error Responses:**

| Status | Error Message | Reason | Details |
|--------|---------------|--------|---------|
| 401 | Unauthorized access | Missing/Invalid JWT token | `{ "reason": "Authentication error" }` |
| 403 | Forbidden access | Insufficient role permissions | `{ "reason": "Authorization error" }` |
| 404 | Job not found | Invalid job ID | `{ "reason": "Database error" }` |

---

#### 8. **Get User Applications**

Retrieve all job applications submitted by the user.

| Property | Value |
|----------|-------|
| **Endpoint** | `/application` |
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
  "message": "User applications retrieved successfully",
  "data": [
    {
      "applicationId": "app-uuid",
      "jobId": "job-uuid",
      "jobTitle": "Senior Developer",
      "companyName": "Tech Corp",
      "status": "applied",
      "appliedAt": "2026-04-23T10:00:00Z"
    },
    {
      "applicationId": "app-uuid-2",
      "jobId": "job-uuid-2",
      "jobTitle": "Junior Developer",
      "companyName": "StartUp Inc",
      "status": "selected",
      "appliedAt": "2026-04-22T10:00:00Z"
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

#### 9. **Get Job by ID**

Retrieve details of a specific job posting.

| Property | Value |
|----------|-------|
| **Endpoint** | `/job/:jobId` |
| **Method** | `GET` |
| **Authentication** | Required (JWT) |
| **Authorization** | Required (role: "user") |

**Request Headers:**

```
Authorization: Bearer <jwt_token>
```

**URL Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `jobId` | string | Yes | ID of the job to retrieve |

**Request Body:** Not applicable

**Success Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Job details retrieved successfully",
  "data": {
    "jobId": "job-uuid",
    "jobTitle": "Senior Developer",
    "companyName": "Tech Corp",
    "location": "New York, NY",
    "salary": "$120,000 - $150,000",
    "description": "Looking for experienced developer...",
    "requirements": ["Node.js", "React", "PostgreSQL"],
    "postedDate": "2026-04-20T10:00:00Z",
    "applicantCount": 15
  }
}
```

**Error Responses:**

| Status | Error Message | Reason | Details |
|--------|---------------|--------|---------|
| 401 | Unauthorized access | Missing/Invalid JWT token | `{ "reason": "Authentication error" }` |
| 403 | Forbidden access | Insufficient role permissions | `{ "reason": "Authorization error" }` |
| 404 | Job not found | Invalid job ID | `{ "reason": "Database error" }` |

---

#### 10. **Get All Jobs**

Retrieve all available job postings.

| Property | Value |
|----------|-------|
| **Endpoint** | `/jobs` |
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
  "message": "All jobs retrieved successfully",
  "data": [
    {
      "jobId": "job-uuid",
      "jobTitle": "Senior Developer",
      "companyName": "Tech Corp",
      "location": "New York, NY",
      "salary": "$120,000 - $150,000",
      "description": "Looking for experienced developer...",
      "postedDate": "2026-04-20T10:00:00Z"
    },
    {
      "jobId": "job-uuid-2",
      "jobTitle": "Junior Developer",
      "companyName": "StartUp Inc",
      "location": "San Francisco, CA",
      "salary": "$80,000 - $100,000",
      "description": "Entry-level position for fresh graduates...",
      "postedDate": "2026-04-21T10:00:00Z"
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

### Admin Routes

All admin routes are prefixed with `/api/admin`

---

#### 1. **Admin Sign-Up / Registration**

Create a new admin account.

| Property | Value |
|----------|-------|
| **Endpoint** | `/sign-up` |
| **Method** | `POST` |
| **Authentication** | Not required |
| **Authorization** | Not required |

**Request Body:**

```json
{
  "firstName": "Admin",
  "lastName": "User",
  "email": "admin@example.com",
  "password": "securePassword123",
  "role": "admin"
}
```

**Request Parameters:**

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `firstName` | string | Yes | - |
| `lastName` | string | Yes | - |
| `email` | string | Yes | Must be valid email format |
| `password` | string | Yes | Minimum 8 characters |
| `role` | string | Yes | Must be "admin" |

**Success Response (201):**

```json
{
  "success": true,
  "statusCode": 201,
  "message": "Admin Created Successfully",
  "data": [
    {
      "id": "admin-uuid",
      "firstName": "Admin",
      "lastName": "User",
      "email": "admin@example.com",
      "role": "admin",
      "createdAt": "2026-04-23T10:00:00Z",
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  ]
}
```

**Error Responses:**

| Status | Error Message | Reason | Details |
|--------|---------------|--------|---------|
| 400 | Validation Error | Missing/Invalid fields | `{ "firstName": "First name is required", "email": "Invalid email format", ... }` |
| 409 | Admin already exists with this email | Duplicate email | `{ "reason": "Database error" }` |

---

#### 2. **Admin Login**

Authenticate admin with email and password.

| Property | Value |
|----------|-------|
| **Endpoint** | `/login` |
| **Method** | `POST` |
| **Authentication** | Not required |
| **Authorization** | Not required |

**Request Body:**

```json
{
  "email": "admin@example.com",
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
    "id": "admin-uuid",
    "firstName": "Admin",
    "lastName": "User",
    "email": "admin@example.com",
    "role": "admin",
    "createdAt": "2026-04-23T10:00:00Z",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**

| Status | Error Message | Reason | Details |
|--------|---------------|--------|---------|
| 400 | Validation Error | Missing fields | `{ "email": "Email is required", "password": "Password is required" }` |
| 404 | Admin not found with this email | Admin doesn't exist | `{ "reason": "Database error" }` |
| 401 | Invalid password | Wrong password | `{ "reason": "Authentication error" }` |

---

#### 3. **Create a Job**

Create a new job posting.

| Property | Value |
|----------|-------|
| **Endpoint** | `/job/create` |
| **Method** | `POST` |
| **Authentication** | Required (JWT) |
| **Authorization** | Required (role: "admin") |

**Request Headers:**

```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "jobTitle": "Senior Developer",
  "description": "We are looking for an experienced developer...",
  "requirements": ["Node.js", "React", "PostgreSQL"],
  "location": "New York, NY",
  "salary": "$120,000 - $150,000"
}
```

**Request Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `jobTitle` | string | Yes | Title of the job position |
| `description` | string | Yes | Detailed job description |
| `requirements` | array | Yes | List of required skills/qualifications |
| `location` | string | Yes | Job location |
| `salary` | string | Yes | Salary range |

**Success Response (201):**

```json
{
  "success": true,
  "statusCode": 201,
  "message": "Job created successfully",
  "data": {
    "jobId": "job-uuid",
    "jobTitle": "Senior Developer",
    "description": "We are looking for an experienced developer...",
    "requirements": ["Node.js", "React", "PostgreSQL"],
    "location": "New York, NY",
    "salary": "$120,000 - $150,000",
    "postedDate": "2026-04-23T10:00:00Z",
    "adminId": "admin-uuid"
  }
}
```

**Error Responses:**

| Status | Error Message | Reason | Details |
|--------|---------------|--------|---------|
| 400 | Validation Error | Missing/Invalid fields | `{ "jobTitle": "Job title is required", ... }` |
| 401 | Unauthorized access | Missing/Invalid JWT token | `{ "reason": "Authentication error" }` |
| 403 | Forbidden access | Insufficient role permissions | `{ "reason": "Authorization error" }` |

---

#### 4. **Update a Job**

Update an existing job posting.

| Property | Value |
|----------|-------|
| **Endpoint** | `/job/update/:id` |
| **Method** | `PATCH` |
| **Authentication** | Required (JWT) |
| **Authorization** | Required (role: "admin") |

**Request Headers:**

```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**URL Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | ID of the job to update |

**Request Body:**

```json
{
  "jobTitle": "Senior Developer (Updated)",
  "description": "Updated job description...",
  "requirements": ["Node.js", "React", "MongoDB"],
  "salary": "$130,000 - $160,000"
}
```

**Request Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `jobTitle` | string | No | Updated job title |
| `description` | string | No | Updated job description |
| `requirements` | array | No | Updated skill requirements |
| `salary` | string | No | Updated salary range |

**Success Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Job updated successfully",
  "data": {
    "jobId": "job-uuid",
    "jobTitle": "Senior Developer (Updated)",
    "description": "Updated job description...",
    "requirements": ["Node.js", "React", "MongoDB"],
    "salary": "$130,000 - $160,000",
    "updatedAt": "2026-04-23T12:00:00Z"
  }
}
```

**Error Responses:**

| Status | Error Message | Reason | Details |
|--------|---------------|--------|---------|
| 401 | Unauthorized access | Missing/Invalid JWT token | `{ "reason": "Authentication error" }` |
| 403 | Forbidden access | Insufficient role permissions | `{ "reason": "Authorization error" }` |
| 404 | Job not found | Invalid job ID | `{ "reason": "Database error" }` |

---

#### 5. **Get Job Details**

Retrieve details of a specific job posting.

| Property | Value |
|----------|-------|
| **Endpoint** | `/job/:id` |
| **Method** | `GET` |
| **Authentication** | Required (JWT) |
| **Authorization** | Required (role: "admin") |

**Request Headers:**

```
Authorization: Bearer <jwt_token>
```

**URL Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | ID of the job to retrieve |

**Request Body:** Not applicable

**Success Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Job details retrieved successfully",
  "data": {
    "jobId": "job-uuid",
    "jobTitle": "Senior Developer",
    "description": "Looking for experienced developer...",
    "requirements": ["Node.js", "React", "PostgreSQL"],
    "location": "New York, NY",
    "salary": "$120,000 - $150,000",
    "postedDate": "2026-04-20T10:00:00Z",
    "applicantCount": 15
  }
}
```

**Error Responses:**

| Status | Error Message | Reason | Details |
|--------|---------------|--------|---------|
| 401 | Unauthorized access | Missing/Invalid JWT token | `{ "reason": "Authentication error" }` |
| 403 | Forbidden access | Insufficient role permissions | `{ "reason": "Authorization error" }` |
| 404 | Job not found | Invalid job ID | `{ "reason": "Database error" }` |

---

#### 6. **Register Company**

Register or update company information.

| Property | Value |
|----------|-------|
| **Endpoint** | `/org` |
| **Method** | `PATCH` |
| **Authentication** | Required (JWT) |
| **Authorization** | Required (role: "admin") |
| **Content-Type** | `multipart/form-data` |

**Request Headers:**

```
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data
```

**Request Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `companyImg` | file | No | Company logo or image (image file) |

**Example cURL:**

```bash
curl -X PATCH http://localhost:3000/api/admin/org \
  -H "Authorization: Bearer <jwt_token>" \
  -F "companyImg=@/path/to/company-logo.jpg"
```

**Success Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Company registered successfully",
  "data": {
    "companyId": "company-uuid",
    "companyImg": "https://cloudinary.url/company-logo.jpg",
    "adminId": "admin-uuid",
    "registeredAt": "2026-04-23T10:00:00Z"
  }
}
```

**Error Responses:**

| Status | Error Message | Reason | Details |
|--------|---------------|--------|---------|
| 400 | Nothing to update | No files provided | `{ "reason": "Send companyImg file" }` |
| 401 | Unauthorized access | Missing/Invalid JWT token | `{ "reason": "Authentication error" }` |
| 403 | Forbidden access | Insufficient role permissions | `{ "reason": "Authorization error" }` |

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
   npm run dev
   ```

The API will be available at `http://localhost:3000` (or your configured port)
The Live API will be live at `https://job-portal-mangement-backend.onrender.com`
---

## Future Enhancements

- Admin routes for job management
- Application tracking and status updates
- Email notifications
- Advanced search and filtering
- Pagination for large datasets