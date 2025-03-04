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

// Configure CORS
const corsOptions = {
  origin: ['http://localhost:3000', 'https://entertainment-web-app-lilac.vercel.app', 'https://entertainment-web-app-topaz.vercel.app', 'https://emilia-burza-entertainment-app.netlify.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Origin', 'Accept'],
  credentials: true,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

// Logging middleware - apply to ALL requests
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[DEBUG] Handling ${req.method} request to ${req.url} from origin: ${req.headers.origin || 'unknown'}`);
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

// Root endpoint - sends all shows by default, or trending if trending=true query param is present
app.get('/', function(req: Request, res: Response) {
  const handleRequest = async () => {
    try {
      // Check if the trending query parameter is present
      const trending = req.query.trending === 'true';
      
      if (trending) {
        console.log('Fetching trending shows...');
        const trendingShows = await tmdbService.getAllTrending();
        const response = {
          status: true,
          data: { trending: trendingShows }  // Keep as 'trending' for client compatibility
        };
        res.status(200).json(response);
      } else {
        console.log('Fetching all shows...');
        const allShows = await tmdbService.getAllShows();
        const response = {
          status: true,
          data: { shows: allShows }
        };
        res.status(200).json(response);
      }
    } catch (error) {
      console.error('Error in root endpoint:', error);
      const response = {
        status: false,
        error: 'Internal server error',
        message: 'Error fetching shows'
      };
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
      // Structure response for client compatibility
      const response = {
        status: true,
        data: { shows: movies }  // Use 'shows' key for consistency with client
      };
      res.status(200).json(response);
    } catch (error) {
      console.error('Error fetching movies:', error);
      const response = {
        status: false,
        error: 'Internal server error',
        message: 'Error fetching movies'
      };
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
      // Structure response for client compatibility
      const response = {
        status: true,
        data: { shows: movies }  // Use 'shows' key for consistency with client
      };
      res.status(200).json(response);
    } catch (error) {
      console.error('Error fetching movies:', error);
      const response = {
        status: false,
        error: 'Internal server error',
        message: 'Error fetching movies'
      };
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
      // Structure response for client compatibility
      const response = {
        status: true,
        data: { shows: tvSeries }  // Use 'shows' key for consistency with client
      };
      res.status(200).json(response);
    } catch (error) {
      console.error('Error fetching TV series:', error);
      const response = {
        status: false,
        error: 'Internal server error',
        message: 'Error fetching TV series'
      };
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
      // Structure response for client compatibility
      const response = {
        status: true,
        data: { shows: tvSeries }  // Use 'shows' key for consistency with client
      };
      res.status(200).json(response);
    } catch (error) {
      console.error('Error fetching TV series:', error);
      const response = {
        status: false,
        error: 'Internal server error',
        message: 'Error fetching TV series'
      };
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
        const response = {
          status: false,
          error: 'Bad request',
          message: 'Query parameter is required'
        };
        return res.status(400).json(response);
      }
      
      const results = await tmdbService.searchByKeyword(query);
      // Structure response for client compatibility
      const response = {
        status: true,
        data: { shows: results }  // Use 'shows' key for consistency with client
      };
      res.status(200).json(response);
    } catch (error) {
      console.error('Error searching:', error);
      const response = {
        status: false,
        error: 'Internal server error',
        message: 'Error searching'
      };
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
        const response = {
          status: false,
          error: 'Bad request',
          message: 'Query parameter is required'
        };
        return res.status(400).json(response);
      }
      
      const results = await tmdbService.searchByKeyword(query);
      // Structure response for client compatibility
      const response = {
        status: true,
        data: { shows: results }  // Use 'shows' key for consistency with client
      };
      res.status(200).json(response);
    } catch (error) {
      console.error('Error searching:', error);
      const response = {
        status: false,
        error: 'Internal server error',
        message: 'Error searching'
      };
      res.status(500).json(response);
    }
  };
  
  handleRequest();
});

// Bookmarked endpoint (without /api prefix)
app.get('/bookmarked', function(req: Request, res: Response) {
  // This is a placeholder for the bookmarked endpoint
  // In a real implementation, this would fetch bookmarked shows from a database
  const response = {
    status: true,
    data: { shows: [] }  // Use 'shows' key for consistency with client
  };
  res.status(200).json(response);
});

// Bookmarked shows
app.get('/api/bookmarked', function(req: Request, res: Response) {
  const handleRequest = async () => {
    try {
      // Placeholder response until bookmarking functionality is implemented
      const response = {
        status: true,
        data: { shows: [] }  // Use 'shows' key for consistency with client
      };
      res.status(200).json(response);
    } catch (error) {
      console.error('Error getting bookmarked shows:', error);
      const response = {
        status: false,
        error: 'Internal server error',
        message: 'Error getting bookmarked shows'
      };
      res.status(500).json(response);
    }
  };
  
  handleRequest();
});

// Fallback route
app.use('*', function(req: Request, res: Response) {
  const response = createApiResponse(false, undefined, 'Route not found', 'Not found', 404);
  res.status(404).json(response);
});

// Export the serverless handler
export const handler = serverless(app, {
  // Configure the serverless handler to include CORS headers
  binary: ['application/octet-stream', 'application/json']
});