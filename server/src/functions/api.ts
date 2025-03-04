import express from 'express';
import serverless from 'serverless-http';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import showsRouter from '../routes/shows';
import bookmarkedRouter from '../routes/bookmarked';
import tvRouter from '../routes/tv';
import moviesRouter from '../routes/movies';
import searchRouter from '../routes/search';
import connectToDatabase from '../config/db';
import errorHandler from '../middleware/error';
import logging from '../config/logger';
import cors from 'cors';

// Connect to the database
connectToDatabase();

// Logger
logging();

// Create the express app
const app = express();

// CORS
app.use(cors());

// JSON parser
app.use(express.json());

// Routes
app.use('/api/shows', showsRouter);
app.use('/api/bookmarked', bookmarkedRouter);
app.use('/api/tv', tvRouter);
app.use('/api/movies', moviesRouter);
app.use('/api/search', searchRouter);

// Error handler
app.use(errorHandler);

// Export the serverless function
export const handler = serverless(app); 