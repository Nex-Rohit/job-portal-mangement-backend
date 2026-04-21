import express from 'express';
import errorMiddleware from './middleware/errorMiddleware.js';

const app = express();

// App level middleware
app.use(express.json());

// Route level middleware
// (Add your routes here)
app.post("/",(req,res)=>{
    res.send("Hello World")
});

// Error handling middleware
app.use(errorMiddleware);

export default app;