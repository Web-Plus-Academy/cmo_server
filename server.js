import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import bodyParser from 'body-parser';

import router from './src/router/login.router.js';
import projectrouter from './src/router/projectroute.js'
import connectToMongoDB from './src/config/dbConnect.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true, // Allow cookies to be sent
};

console.log('CORS Options:', corsOptions); // Log CORS options
``
app.use(cors(corsOptions));
app.use(express.json()); 
app.use(cookieParser());
app.use(bodyParser.json());

app.use('/api/admin',router);
app.use('/projects',projectrouter)
app.listen(PORT, () => {
    connectToMongoDB();
    console.log(`Server is running in port ${PORT}`);
})
