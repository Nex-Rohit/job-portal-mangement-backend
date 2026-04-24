# Swagger API Documentation Setup

## Overview
Your Job Portal Management API now has Swagger documentation configured with `swagger-ui-express` and `swagger-autogen`.

## How to Use

### 1. **Generate/Update Swagger Documentation**
Whenever you update your API routes or want to regenerate the documentation, run:
```bash
npm run swagger:generate
```
This will update the `swagger-output.json` file based on your current routes.

### 2. **Access Swagger UI**
Start your development server:
```bash
npm run dev
```

Then visit:
```
http://localhost:8080/api-docs
```

## API Documentation

### Available Endpoints

#### **User Routes** (`/api/v1/user`)
- `POST /sign-up` - Register a new user
- `POST /login` - Login user
- `GET /profile` - Get user profile (requires JWT)
- `PATCH /profile` - Update user profile with files (requires JWT)

#### **User Education Routes** (`/api/v1/user`)
- `POST /education` - Add education details (requires JWT)
- `GET /education` - Get user education details (requires JWT)

#### **User Job Routes** (`/api/v1/user`)
- `POST /apply/{jobId}` - Apply for a job (requires JWT)
- `GET /application` - Get user's job applications (requires JWT)

#### **Admin/Recruiter Routes** (`/api/v1/recruiter`)
- `POST /sign-up` - Register a new recruiter
- `POST /login` - Login recruiter
- `POST /job/create` - Create a new job (requires JWT)
- `PATCH /job/update/{id}` - Update a job (requires JWT)
- `GET /job/{id}` - Get job details (requires JWT)
- `GET /jobs` - Get all jobs posted by recruiter (requires JWT)
- `PATCH /org` - Register/update company with image (requires JWT)
- `PATCH /job/application/{id}` - Update application status (requires JWT)
- `GET /job/applications/all/{jobId}` - Get all applications for a job (requires JWT)

## Authentication

### Bearer Token (JWT)
Most endpoints require JWT authentication. To use protected endpoints:

1. First, call the login endpoint (`/sign-up` or `/login`)
2. You'll receive a JWT token in the response
3. Add the token to your requests in the Authorization header:
   ```
   Authorization: Bearer <your_jwt_token>
   ```

In Swagger UI:
1. Click the "Authorize" button
2. Enter your JWT token in the Bearer token field
3. Click "Authorize"

## File Structure

```
project-root/
├── swagger.js                 # Swagger configuration file
├── swagger-output.json        # Generated OpenAPI specification
├── src/
│   ├── app.js                # Express app with Swagger UI setup
│   ├── server.js             # Server entry point
│   ├── routes/
│   │   ├── userRoutes.js
│   │   └── adminRoutes.js
│   └── ...
└── package.json
```

## Customization

### Modify Swagger Configuration
Edit `swagger.js` to:
- Update API info (title, description, version)
- Add new schemas for request/response models
- Modify servers (development/production URLs)
- Update contact information

### Update Routes Documentation
After modifying routes, regenerate the documentation:
```bash
npm run swagger:generate
```

## NPM Scripts

```json
{
  "dev": "nodemon src/server.js",           // Start dev server
  "start": "node src/server.js",            // Start production server
  "swagger:generate": "node swagger.js",    // Generate Swagger docs
  "build": "npm run swagger:generate && prisma generate && node src/server.js"
}
```

## Example Usage

### Testing Endpoints in Swagger UI

1. **Register a User**
   - Navigate to `/api-docs`
   - Find "User" section > "POST /user/sign-up"
   - Click "Try it out"
   - Enter JSON:
     ```json
     {
       "email": "user@example.com",
       "password": "securePassword123",
       "role": "user"
     }
     ```
   - Click "Execute"

2. **Login**
   - Find "User" section > "POST /user/login"
   - Enter credentials
   - Copy the JWT token from response

3. **Access Protected Routes**
   - Click "Authorize" button
   - Paste your JWT token (just the token, without "Bearer" prefix)
   - Now you can call protected endpoints

## Tips

- ✅ Run `npm run swagger:generate` after adding/modifying routes
- ✅ Keep detailed descriptions in your route comments
- ✅ Use meaningful HTTP status codes
- ✅ Document request/response schemas
- ⚠️ Don't commit `swagger-output.json` if you want it auto-generated (optional - add to .gitignore)

## Troubleshooting

**Swagger UI not loading?**
- Make sure you ran `npm run swagger:generate` first
- Check that `swagger-output.json` exists
- Verify the port (default: 8080)

**Routes not showing in Swagger?**
- Run `npm run swagger:generate` again
- Check that routes are properly exported
- Verify route syntax in controller functions

**Authorization not working?**
- Ensure your JWT token is valid
- Token format should be: `Authorization: Bearer <token>`
- Check that middleware is correctly applied to routes
