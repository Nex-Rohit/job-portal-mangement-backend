import express from 'express';
import cors from 'cors';
import errorMiddleware from './middleware/errorMiddleware.js';
import userRoutes from "./routes/userRoutes.js"
import adminRoutes from "./routes/adminRoutes.js"
const app = express();

// App level middleware
app.use(cors());
app.use(express.json());

// Route level middleware
// (Add your routes here)
app.post("/",(req,res)=>{
    res.send("Hello World")
});

app.use("/api/v1/user",userRoutes);
app.use("/api/v1/recruiter",adminRoutes)
// Error handling middleware
app.use(errorMiddleware);

export default app;