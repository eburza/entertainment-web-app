import express from 'express';
import serverless from 'serverless-http';
import path from 'path';
import dotenv from 'dotenv';
import cors from 'cors';
import axios from 'axios';

// Load environment variables first
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Create the express app
const app = express();

// CORS
app.use(cors());

// JSON parser
app.use(express.json());

// TMDB Configuration
const TMDB_BASE_URL = process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3';
const TMDB_API_ACCESS_TOKEN = process.env.TMDB_API_ACCESS_TOKEN || '';
const TMDB_API_KEY = process.env.TMDB_API_KEY || '';

// Try to import routes and other components
try {
  // Import routes
  const showsRouter = require('../routes/shows');
  const bookmarkedRouter = require('../routes/bookmarked');
  const tvRouter = require('../routes/tv');
  const moviesRouter = require('../routes/movies');
  const searchRouter = require('../routes/search');

  // Import other components
  const connectToDatabase = require('../config/db');
  const errorHandler = require('../middleware/error');
  const logging = require('../config/logger');

  // Connect to the database
  connectToDatabase.default();

  // Logger
  logging.default();

  // Routes
  app.use('/api/shows', showsRouter.default);
  app.use('/api/bookmarked', bookmarkedRouter.default);
  app.use('/api/tv', tvRouter.default);
  app.use('/api/movies', moviesRouter.default);
  app.use('/api/search', searchRouter.default);

  // Error handler
  app.use(errorHandler.default);
} catch (error) {
  console.error('Error loading modules:', error);
  
  // Fallback implementation for /api/shows if the module isn't available
  app.get('/api/shows', async (req, res) => {
    try {
      const tmdbApi = axios.create({
        baseURL: TMDB_BASE_URL,
        headers: {
          Authorization: `Bearer ${TMDB_API_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
      });
      
      // Fetch movies
      const moviesResponse = await tmdbApi.get('/trending/movie/day', {
        params: { api_key: TMDB_API_KEY }
      });
      
      // Fetch TV shows
      const tvResponse = await tmdbApi.get('/trending/tv/day', {
        params: { api_key: TMDB_API_KEY }
      });
      
      const shows = [...moviesResponse.data.results, ...tvResponse.data.results];
      
      res.status(200).json({
        status: 200,
        data: { shows }
      });
    } catch (error) {
      console.error('Error fetching shows:', error);
      res.status(500).json({
        status: 500,
        message: 'Error fetching shows'
      });
    }
  });
}

// Basic health check endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'API is running',
    env: {
      TMDB_BASE_URL: TMDB_BASE_URL ? 'Set' : 'Not set',
      TMDB_API_KEY: TMDB_API_KEY ? 'Set' : 'Not set',
      TMDB_API_ACCESS_TOKEN: TMDB_API_ACCESS_TOKEN ? 'Set' : 'Not set',
      NODE_ENV: process.env.NODE_ENV || 'Not set'
    }
  });
});

// Fallback route
app.use('*', (req, res) => {
  res.status(404).json({
    status: 404,
    message: 'Route not found'
  });
});

// Export the serverless function
export const handler = serverless(app); 