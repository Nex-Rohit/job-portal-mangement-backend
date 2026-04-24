import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';
import errorMiddleware from './middleware/errorMiddleware.js';
import userRoutes from "./routes/userRoutes.js"
import adminRoutes from "./routes/adminRoutes.js"
const app = express();

// App level middleware
app.use(cors());
app.use(express.json());

// Swagger UI setup
try {
  const swaggerFile = JSON.parse(fs.readFileSync(path.join(path.resolve(), 'swagger-output.json'), 'utf8'));
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile, {
    swaggerOptions: {
      docExpansion: 'list',
      defaultModelsExpandDepth: 1
    },
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Job Portal API Documentation'
  }));
} catch (error) {
  console.warn('Swagger documentation not available. Run "npm run swagger:generate" to generate it.');
}

// Route level middleware
app.get("/",(req,res)=>{
    res.send("Job Portal Management Backend API - Visit /api-docs for documentation")
});

app.use("/api/v1/user",userRoutes);
app.use("/api/v1/recruiter",adminRoutes)
// Error handling middleware
app.use(errorMiddleware);

export default app;