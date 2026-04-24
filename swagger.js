import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    version: '1.0.0',
    title: 'Job Portal Management API',
    description: 'API documentation for Job Portal Management Backend - A comprehensive job portal backend with user and recruiter functionalities',
    contact: {
      name: 'Rohit Singh',
      email: 'contact@example.com'
    },
    license: {
      name: 'ISC',
    }
  },
  host: 'localhost:8080',
  basePath: '/api/v1',
  schemes: ['http', 'https'],
  consumes: ['application/json'],
  produces: ['application/json'],
  securityDefinitions: {
    bearerAuth: {
      type: 'apiKey',
      in: 'header',
      name: 'Authorization',
      description: 'JWT Authorization header using the Bearer scheme. Example: "Bearer {token}"',
    }
  },
  tags: [
    {
      name: 'User',
      description: 'User authentication and profile management'
    },
    {
      name: 'User - Education',
      description: 'User education details management'
    },
    {
      name: 'User - Jobs',
      description: 'Job browsing and application'
    },
    {
      name: 'Admin',
      description: 'Admin/Recruiter authentication'
    },
    {
      name: 'Admin - Jobs',
      description: 'Job management and creation'
    },
    {
      name: 'Admin - Company',
      description: 'Company/Organization management'
    },
    {
      name: 'Admin - Applications',
      description: 'Job application management'
    }
  ],
  definitions: {
    UserRegister: {
      type: 'object',
      required: ['email', 'password', 'role'],
      properties: {
        email: {
          type: 'string',
          example: 'user@example.com'
        },
        password: {
          type: 'string',
          example: 'securePassword123'
        },
        role: {
          type: 'string',
          enum: ['user'],
          example: 'user'
        }
      }
    },
    UserLogin: {
      type: 'object',
      required: ['email', 'password'],
      properties: {
        email: {
          type: 'string',
          example: 'user@example.com'
        },
        password: {
          type: 'string',
          example: 'securePassword123'
        }
      }
    },
    UserProfile: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          example: 'user_123'
        },
        email: {
          type: 'string',
          example: 'user@example.com'
        },
        firstName: {
          type: 'string',
          example: 'John'
        },
        lastName: {
          type: 'string',
          example: 'Doe'
        },
        phoneNumber: {
          type: 'string',
          example: '+1234567890'
        },
        profilePhoto: {
          type: 'string',
          example: 'https://cloudinary.com/image.jpg'
        },
        resume: {
          type: 'string',
          example: 'https://cloudinary.com/resume.pdf'
        }
      }
    },
    Education: {
      type: 'object',
      required: ['school', 'degree', 'fieldOfStudy'],
      properties: {
        id: {
          type: 'string',
          example: 'edu_123'
        },
        school: {
          type: 'string',
          example: 'University of Technology'
        },
        degree: {
          type: 'string',
          example: 'Bachelor'
        },
        fieldOfStudy: {
          type: 'string',
          example: 'Computer Science'
        },
        startDate: {
          type: 'string',
          format: 'date',
          example: '2020-01-01'
        },
        endDate: {
          type: 'string',
          format: 'date',
          example: '2024-01-01'
        }
      }
    },
    Job: {
      type: 'object',
      required: ['title', 'description', 'companyId'],
      properties: {
        id: {
          type: 'string',
          example: 'job_123'
        },
        title: {
          type: 'string',
          example: 'Senior Software Engineer'
        },
        description: {
          type: 'string',
          example: 'We are looking for an experienced software engineer'
        },
        location: {
          type: 'string',
          example: 'San Francisco, CA'
        },
        salary: {
          type: 'string',
          example: '$100,000 - $150,000'
        },
        jobType: {
          type: 'string',
          example: 'Full-time'
        },
        companyId: {
          type: 'string',
          example: 'company_123'
        }
      }
    },
    Application: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          example: 'app_123'
        },
        userId: {
          type: 'string',
          example: 'user_123'
        },
        jobId: {
          type: 'string',
          example: 'job_123'
        },
        status: {
          type: 'string',
          enum: ['pending', 'accepted', 'rejected'],
          example: 'pending'
        },
        appliedAt: {
          type: 'string',
          format: 'date-time',
          example: '2024-04-24T10:30:00Z'
        }
      }
    },
    Error: {
      type: 'object',
      properties: {
        success: {
          type: 'boolean',
          example: false
        },
        message: {
          type: 'string',
          example: 'An error occurred'
        }
      }
    }
  }
};

const outputFile = './swagger-output.json';
const routes = ['./src/server.js'];

swaggerAutogen({ openapi: '3.0.0' })(outputFile, routes, doc);
