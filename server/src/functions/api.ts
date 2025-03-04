import express, { Request, Response, NextFunction } from 'express';
import serverless from 'serverless-http';
import path from 'path';
import dotenv from 'dotenv';
import cors from 'cors';
import { ApiResponse, createApiResponse } from '../types/apiResponseType';
import { tmdbService } from '../services/tmdb/tmdb.service';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Create the express app
const app = express();

// CORS configuration - allow all origins for now to debug
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Origin', 'Accept'],
  credentials: true,
  optionsSuccessStatus: 204,
  preflightContinue: false
}));

// Add CORS headers to all responses as a fallback
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }
  
  next();
});

// JSON parser
app.use(express.json());

// Log all requests for debugging
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[DEBUG] ${req.method} ${req.path} - Headers:`, JSON.stringify(req.headers));
  
  // Add a response interceptor to log responses
  const originalSend = res.send;
  res.send = function(body) {
    console.log(`[DEBUG] Response for ${req.method} ${req.path} - Status: ${res.statusCode}`);
    return originalSend.call(this, body);
  };
  
  next();
});

// Basic health check endpoint that also serves as shows/trending endpoint
app.get('/', function(req: Request, res: Response) {
  const handleRequest = async () => {
    try {
      // Check if this is a health check request (e.g., from Netlify)
      const isHealthCheck = req.query.health === 'check' || req.headers['user-agent']?.includes('Netlify');
      
      if (isHealthCheck) {
        const response = createApiResponse(
          true, 
          {
            status: 'ok',
            message: 'API is running',
            env: {
              TMDB_BASE_URL: process.env.TMDB_BASE_URL ? 'Set' : 'Not set',
              TMDB_API_KEY: process.env.TMDB_API_KEY ? 'Set' : 'Not set',
              TMDB_API_ACCESS_TOKEN: process.env.TMDB_API_ACCESS_TOKEN ? 'Set' : 'Not set',
              NODE_ENV: process.env.NODE_ENV || 'Not set'
            }
          },
          'API is running',
          undefined,
          200
        );
        
        return res.status(200).json(response);
      }
      
      // Check if this is a request for trending content
      const isTrending = req.query.trending === 'true' || req.headers['x-request-trending'] === 'true';
      
      if (isTrending) {
        const trending = await tmdbService.getAllTrending();
        const response = createApiResponse(true, { trending }, 'Trending shows fetched successfully', undefined, 200);
        return res.status(200).json(response);
      }
      
      // Otherwise, treat it as a request for shows
      const shows = await tmdbService.getAllShows();
      const response = createApiResponse(true, { shows }, 'Shows fetched successfully', undefined, 200);
      res.status(200).json(response);
    } catch (error) {
      console.error('Error in root endpoint:', error);
      const response = createApiResponse(false, undefined, 'Error processing request', 'Internal server error', 500);
      res.status(500).json(response);
    }
  };
  
  handleRequest();
});

// Shows endpoint - Not needed as root endpoint handles this
// app.get('/api/shows', function(req: Request, res: Response) {
//   const handleRequest = async () => {
//     try {
//       const shows = await tmdbService.getAllShows();
//       const response = createApiResponse(true, { shows }, 'Shows fetched successfully', undefined, 200);
//       res.status(200).json(response);
//     } catch (error) {
//       console.error('Error fetching shows:', error);
//       const response = createApiResponse(false, undefined, 'Error fetching shows', 'Internal server error', 500);
//       res.status(500).json(response);
//     }
//   };
//   
//   handleRequest();
// });

// Movies endpoint (without /api prefix)
app.get('/movies', function(req: Request, res: Response) {
  const handleRequest = async () => {
    try {
      const movies = await tmdbService.getMovies();
      const response = createApiResponse(true, { movies }, 'Movies fetched successfully', undefined, 200);
      res.status(200).json(response);
    } catch (error) {
      console.error('Error fetching movies:', error);
      const response = createApiResponse(false, undefined, 'Error fetching movies', 'Internal server error', 500);
      res.status(500).json(response);
    }
  };
  
  handleRequest();
});

// Movies endpoint
app.get('/api/movies', function(req: Request, res: Response) {
  const handleRequest = async () => {
    try {
      const movies = await tmdbService.getMovies();
      const response = createApiResponse(true, { movies }, 'Movies fetched successfully', undefined, 200);
      res.status(200).json(response);
    } catch (error) {
      console.error('Error fetching movies:', error);
      const response = createApiResponse(false, undefined, 'Error fetching movies', 'Internal server error', 500);
      res.status(500).json(response);
    }
  };
  
  handleRequest();
});

// TV endpoint (without /api prefix)
app.get('/tv', function(req: Request, res: Response) {
  const handleRequest = async () => {
    try {
      const tvSeries = await tmdbService.getTvSeries();
      const response = createApiResponse(true, { tvSeries }, 'TV series fetched successfully', undefined, 200);
      res.status(200).json(response);
    } catch (error) {
      console.error('Error fetching TV series:', error);
      const response = createApiResponse(false, undefined, 'Error fetching TV series', 'Internal server error', 500);
      res.status(500).json(response);
    }
  };
  
  handleRequest();
});

// TV endpoint
app.get('/api/tv', function(req: Request, res: Response) {
  const handleRequest = async () => {
    try {
      const tvSeries = await tmdbService.getTvSeries();
      const response = createApiResponse(true, { tvSeries }, 'TV series fetched successfully', undefined, 200);
      res.status(200).json(response);
    } catch (error) {
      console.error('Error fetching TV series:', error);
      const response = createApiResponse(false, undefined, 'Error fetching TV series', 'Internal server error', 500);
      res.status(500).json(response);
    }
  };
  
  handleRequest();
});

// Search endpoint (without /api prefix)
app.get('/search', function(req: Request, res: Response) {
  const handleRequest = async () => {
    try {
      const query = req.query.query as string;
      
      if (!query) {
        const response = createApiResponse(false, undefined, 'Query parameter is required', 'Bad request', 400);
        return res.status(400).json(response);
      }
      
      const results = await tmdbService.searchByKeyword(query);
      const response = createApiResponse(true, { results }, 'Search results fetched successfully', undefined, 200);
      res.status(200).json(response);
    } catch (error) {
      console.error('Error searching:', error);
      const response = createApiResponse(false, undefined, 'Error searching', 'Internal server error', 500);
      res.status(500).json(response);
    }
  };
  
  handleRequest();
});

// Search endpoint
app.get('/api/search', function(req: Request, res: Response) {
  const handleRequest = async () => {
    try {
      const query = req.query.query as string;
      
      if (!query) {
        const response = createApiResponse(false, undefined, 'Query parameter is required', 'Bad request', 400);
        return res.status(400).json(response);
      }
      
      const results = await tmdbService.searchByKeyword(query);
      const response = createApiResponse(true, { results }, 'Search results fetched successfully', undefined, 200);
      res.status(200).json(response);
    } catch (error) {
      console.error('Error searching:', error);
      const response = createApiResponse(false, undefined, 'Error searching', 'Internal server error', 500);
      res.status(500).json(response);
    }
  };
  
  handleRequest();
});

// Bookmarked endpoint (without /api prefix)
app.get('/bookmarked', function(req: Request, res: Response) {
  // This is a placeholder for the bookmarked endpoint
  // In a real implementation, this would fetch bookmarked shows from a database
  const response = createApiResponse(true, { bookmarked: [] }, 'Bookmarked shows fetched successfully', undefined, 200);
  res.status(200).json(response);
});

// Bookmarked endpoint (placeholder)
app.get('/api/bookmarked', function(req: Request, res: Response) {
  // This is a placeholder for the bookmarked endpoint
  // In a real implementation, this would fetch bookmarked shows from a database
  const response = createApiResponse(true, { bookmarked: [] }, 'Bookmarked shows fetched successfully', undefined, 200);
  res.status(200).json(response);
});

// Fallback route
app.use('*', function(req: Request, res: Response) {
  const response = createApiResponse(false, undefined, 'Route not found', 'Not found', 404);
  res.status(404).json(response);
});

// Export the serverless function
export const handler = serverless(app);