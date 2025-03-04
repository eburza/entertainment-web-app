import express, { Request, Response, NextFunction } from 'express';
import serverless from 'serverless-http';
import path from 'path';
import dotenv from 'dotenv';
import cors from 'cors';
import axios from 'axios';
import { ApiResponse, createApiResponse } from '../types/apiResponseType';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Create the express app
const app = express();

// CORS configuration
const corsOptions = {
  origin: ['https://emilia-burza-entertainment-app.netlify.app', 'http://localhost:3000', 'http://localhost:5173'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Apply CORS middleware with options
app.use(cors(corsOptions));

// Add CORS headers to all responses as a fallback
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', 'https://emilia-burza-entertainment-app.netlify.app');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

// JSON parser
app.use(express.json());

// TMDB Configuration
const TMDB_BASE_URL = process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3';
const TMDB_API_ACCESS_TOKEN = process.env.TMDB_API_ACCESS_TOKEN || '';
const TMDB_API_KEY = process.env.TMDB_API_KEY || '';

// Handle OPTIONS requests for CORS preflight
app.options('*', function(req: Request, res: Response) {
  res.status(204).end();
});

// Basic health check endpoint
app.get('/', function(req: Request, res: Response) {
  const response = createApiResponse(
    true, 
    {
      status: 'ok',
      message: 'API is running',
      env: {
        TMDB_BASE_URL: TMDB_BASE_URL ? 'Set' : 'Not set',
        TMDB_API_KEY: TMDB_API_KEY ? 'Set' : 'Not set',
        TMDB_API_ACCESS_TOKEN: TMDB_API_ACCESS_TOKEN ? 'Set' : 'Not set',
        NODE_ENV: process.env.NODE_ENV || 'Not set'
      }
    },
    'API is running',
    undefined,
    200
  );
  
  res.status(200).json(response);
});

// Shows endpoint - both with and without /api prefix for compatibility
app.get('/api/shows', function(req: Request, res: Response) {
  const fetchShows = async () => {
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
      
      const response = createApiResponse(true, { shows }, 'Shows fetched successfully', undefined, 200);
      res.status(200).json(response);
    } catch (error) {
      console.error('Error fetching shows:', error);
      const response = createApiResponse(false, undefined, 'Error fetching shows', 'Internal server error', 500);
      res.status(500).json(response);
    }
  };

  fetchShows();
});

app.get('/shows', function(req: Request, res: Response) {
  const fetchShows = async () => {
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
      
      const response = createApiResponse(true, { shows }, 'Shows fetched successfully', undefined, 200);
      res.status(200).json(response);
    } catch (error) {
      console.error('Error fetching shows:', error);
      const response = createApiResponse(false, undefined, 'Error fetching shows', 'Internal server error', 500);
      res.status(500).json(response);
    }
  };

  fetchShows();
});

// Movies endpoint - both with and without /api prefix
app.get('/api/movies', function(req: Request, res: Response) {
  const fetchMovies = async () => {
    try {
      const tmdbApi = axios.create({
        baseURL: TMDB_BASE_URL,
        headers: {
          Authorization: `Bearer ${TMDB_API_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
      });
      
      const moviesResponse = await tmdbApi.get('/trending/movie/day', {
        params: { api_key: TMDB_API_KEY }
      });
      
      const movies = moviesResponse.data.results;
      
      const response = createApiResponse(true, { movies }, 'Movies fetched successfully', undefined, 200);
      res.status(200).json(response);
    } catch (error) {
      console.error('Error fetching movies:', error);
      const response = createApiResponse(false, undefined, 'Error fetching movies', 'Internal server error', 500);
      res.status(500).json(response);
    }
  };

  fetchMovies();
});

app.get('/movies', function(req: Request, res: Response) {
  const fetchMovies = async () => {
    try {
      const tmdbApi = axios.create({
        baseURL: TMDB_BASE_URL,
        headers: {
          Authorization: `Bearer ${TMDB_API_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
      });
      
      const moviesResponse = await tmdbApi.get('/trending/movie/day', {
        params: { api_key: TMDB_API_KEY }
      });
      
      const movies = moviesResponse.data.results;
      
      const response = createApiResponse(true, { movies }, 'Movies fetched successfully', undefined, 200);
      res.status(200).json(response);
    } catch (error) {
      console.error('Error fetching movies:', error);
      const response = createApiResponse(false, undefined, 'Error fetching movies', 'Internal server error', 500);
      res.status(500).json(response);
    }
  };

  fetchMovies();
});

// TV endpoint - both with and without /api prefix
app.get('/api/tv', function(req: Request, res: Response) {
  const fetchTv = async () => {
    try {
      const tmdbApi = axios.create({
        baseURL: TMDB_BASE_URL,
        headers: {
          Authorization: `Bearer ${TMDB_API_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
      });
      
      const tvResponse = await tmdbApi.get('/trending/tv/day', {
        params: { api_key: TMDB_API_KEY }
      });
      
      const tvSeries = tvResponse.data.results;
      
      const response = createApiResponse(true, { tvSeries }, 'TV series fetched successfully', undefined, 200);
      res.status(200).json(response);
    } catch (error) {
      console.error('Error fetching TV series:', error);
      const response = createApiResponse(false, undefined, 'Error fetching TV series', 'Internal server error', 500);
      res.status(500).json(response);
    }
  };

  fetchTv();
});

app.get('/tv', function(req: Request, res: Response) {
  const fetchTv = async () => {
    try {
      const tmdbApi = axios.create({
        baseURL: TMDB_BASE_URL,
        headers: {
          Authorization: `Bearer ${TMDB_API_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
      });
      
      const tvResponse = await tmdbApi.get('/trending/tv/day', {
        params: { api_key: TMDB_API_KEY }
      });
      
      const tvSeries = tvResponse.data.results;
      
      const response = createApiResponse(true, { tvSeries }, 'TV series fetched successfully', undefined, 200);
      res.status(200).json(response);
    } catch (error) {
      console.error('Error fetching TV series:', error);
      const response = createApiResponse(false, undefined, 'Error fetching TV series', 'Internal server error', 500);
      res.status(500).json(response);
    }
  };

  fetchTv();
});

// Search endpoint
app.get('/api/search', function(req: Request, res: Response) {
  const performSearch = async () => {
    try {
      const query = req.query.query as string;
      
      if (!query) {
        const response = createApiResponse(false, undefined, 'Query parameter is required', 'Bad request', 400);
        return res.status(400).json(response);
      }
      
      const tmdbApi = axios.create({
        baseURL: TMDB_BASE_URL,
        headers: {
          Authorization: `Bearer ${TMDB_API_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
      });
      
      const searchResponse = await tmdbApi.get('/search/multi', {
        params: { 
          api_key: TMDB_API_KEY,
          query
        }
      });
      
      const results = searchResponse.data.results;
      
      const response = createApiResponse(true, { results }, 'Search results fetched successfully', undefined, 200);
      res.status(200).json(response);
    } catch (error) {
      console.error('Error searching:', error);
      const response = createApiResponse(false, undefined, 'Error searching', 'Internal server error', 500);
      res.status(500).json(response);
    }
  };

  performSearch();
});

// Fallback route
app.use('*', function(req: Request, res: Response) {
  const response = createApiResponse(false, undefined, 'Route not found', 'Not found', 404);
  res.status(404).json(response);
});

// Export the serverless function
export const handler = serverless(app);