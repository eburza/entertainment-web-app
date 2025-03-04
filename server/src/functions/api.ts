import express from 'express';
import serverless from 'serverless-http';
import path from 'path';
import dotenv from 'dotenv';
import cors from 'cors';

// Load environment variables first
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Import routes - using path resolution that works with Netlify Functions
const showsRouter = require('../../src/routes/shows');
const bookmarkedRouter = require('../../src/routes/bookmarked');
const tvRouter = require('../../src/routes/tv');
const moviesRouter = require('../../src/routes/movies');
const searchRouter = require('../../src/routes/search');

// Import other components
const connectToDatabase = require('../../src/config/db');
const errorHandler = require('../../src/middleware/error');
const logging = require('../../src/config/logger');

// Connect to the database
connectToDatabase.default();

// Logger
logging.default();

// Create the express app
const app = express();

// CORS
app.use(cors());

// JSON parser
app.use(express.json());

// Routes
app.use('/api/shows', showsRouter.default);
app.use('/api/bookmarked', bookmarkedRouter.default);
app.use('/api/tv', tvRouter.default);
app.use('/api/movies', moviesRouter.default);
app.use('/api/search', searchRouter.default);

// Basic health check endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'API is running'
  });
});

// Error handler
app.use(errorHandler.default);

// Export the serverless function
export const handler = serverless(app); 