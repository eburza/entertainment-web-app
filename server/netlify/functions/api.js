const path = require('path');
const serverless = require('serverless-http');
const express = require('express');
const https = require('https');

// Use dist directory for compiled TypeScript files
const cors = require('../dist/config/cors');
const connectToDatabase = require('../dist/config/db');
const auth = require('../dist/middleware/auth');
const User = require('../dist/models/User');

// Set up environment variables
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

// Create Express app
const app = express();

// Connect to MongoDB 
connectToDatabase();

// Middleware
app.use(express.json());
app.use(cors());
app.use(auth);
app.use(express.urlencoded({ extended: true }));

// Log all requests for debugging
app.use((req, res, next) => {
  console.log(`[DEBUG] Received request: ${req.method} ${req.url}`);
  console.log(`[DEBUG] Request query:`, req.query);
  console.log(`[DEBUG] Request path:`, req.path);
  console.log(`[DEBUG] Request originalUrl:`, req.originalUrl);
  next();
});

// Log environment variables for debugging (will be removed in production)
console.log('TMDB_BASE_URL:', process.env.TMDB_BASE_URL);
console.log('TMDB_API_ACCESS_TOKEN exists:', !!process.env.TMDB_API_ACCESS_TOKEN);
console.log('TMDB_API_KEY exists:', !!process.env.TMDB_API_KEY);

// Create TMDB service directly in this file to reduce dependencies
const TMDB_API_ACCESS_TOKEN = process.env.TMDB_API_ACCESS_TOKEN;
const TMDB_BASE_URL = process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3';
const TMDB_API_KEY = process.env.TMDB_API_KEY;

// Create a simple HTTP request function using Node.js built-in https module
const makeHttpRequest = (url) => {
  return new Promise((resolve, reject) => {
    console.log(`Making request to: ${url}`);
    
    const options = {
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${TMDB_API_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      }
    };
    
    https.get(url, options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(data);
          resolve({ data: parsedData });
        } catch (e) {
          console.error('Error parsing response:', e);
          reject(new Error('Invalid JSON response'));
        }
      });
    }).on('error', (err) => {
      console.error('Request error:', err.message);
      reject(err);
    });
  });
};

// TMDB API
// TMDB API client
const tmdbApi = {
  get: async (endpoint) => {
    const url = `${TMDB_BASE_URL}${endpoint}`;
    return makeHttpRequest(url);
  }
};

// TMDB service
const tmdbService = {
  // Get all shows (movies and TV series)
  async getAllShows() {
    try {
      console.log('Fetching all shows...');
      const [moviesResponse, tvResponse] = await Promise.all([
        tmdbApi.get('/discover/movie?include_adult=false&language=en-US&page=1&sort_by=popularity.desc'),
        tmdbApi.get('/discover/tv?include_adult=false&include_null_first_air_dates=false&language=en-US&page=1&sort_by=popularity.desc')
      ]);

      const moviesReceived = moviesResponse.data.results.map(movie => ({
        id: movie.id,
        title: movie.title || movie.name,
        thumbnail: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        backdrop_path: movie.backdrop_path || '',
        year: new Date(movie.release_date || movie.first_air_date).getFullYear(),
        category: 'Movie',
        media_type: 'movie',
        rating: 'PG',
        vote_average: movie.vote_average || 0,
        isTrending: movie.popularity > 1000,
        isBookmarked: false,
      }));

      const tvReceived = tvResponse.data.results.map(series => ({
        id: series.id,
        title: series.name || series.title,
        thumbnail: `https://image.tmdb.org/t/p/w500${series.poster_path}`,
        backdrop_path: series.backdrop_path || '',
        year: new Date(series.first_air_date || series.release_date).getFullYear(),
        category: 'TV Series',
        media_type: 'tv',
        rating: 'PG',
        vote_average: series.vote_average || 0,
        isTrending: series.popularity > 1000,
        isBookmarked: false,
      }));

      const result = [...moviesReceived, ...tvReceived];
      console.log(`Successfully fetched ${result.length} shows`);
      return result;
    } catch (error) {
      console.error('Error fetching shows:', error);
      throw new Error('Failed to fetch shows');
    }
  },

  // Get movies
  async getMovies() {
    try {
      console.log('Fetching movies...');
      const response = await tmdbApi.get('/discover/movie?include_adult=false&language=en-US&page=1&sort_by=popularity.desc');
      
      const result = response.data.results.map(movie => ({
        id: movie.id,
        title: movie.title,
        thumbnail: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        backdrop_path: movie.backdrop_path || '',
        year: new Date(movie.release_date).getFullYear(),
        category: 'Movie',
        media_type: 'movie',
        rating: 'PG',
        vote_average: movie.vote_average || 0,
        isTrending: movie.popularity > 1000,
        isBookmarked: false,
      }));
      
      console.log(`Successfully fetched ${result.length} movies`);
      return result;
    } catch (error) {
      console.error('Error fetching movies:', error);
      throw new Error('Failed to fetch movies');
    }
  },

  // Get TV series
  async getTvSeries() {
    try {
      const response = await tmdbApi.get('/discover/tv?include_adult=false&include_null_first_air_dates=false&language=en-US&page=1&sort_by=popularity.desc');
      
      return response.data.results.map(series => ({
        id: series.id,
        title: series.name,
        thumbnail: `https://image.tmdb.org/t/p/w500${series.poster_path}`,
        backdrop_path: series.backdrop_path || '',
        year: new Date(series.first_air_date).getFullYear(),
        category: 'TV Series',
        media_type: 'tv',
        rating: 'PG',
        vote_average: series.vote_average || 0,
        isTrending: series.popularity > 1000,
        isBookmarked: false,
      }));
    } catch (error) {
      console.error('Error fetching TV series:', error);
      throw new Error('Failed to fetch TV series');
    }
  },

  // Get all trending
  async getAllTrending() {
    try {
      console.log('Fetching trending shows...');
      const response = await tmdbApi.get('/trending/all/day');
      
      const result = response.data.results.map(item => ({
        id: item.id,
        title: item.title || item.name,
        thumbnail: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
        backdrop_path: item.backdrop_path || '',
        year: new Date(item.release_date || item.first_air_date).getFullYear(),
        category: item.media_type === 'movie' ? 'Movie' : 'TV Series',
        media_type: item.media_type || 'movie',
        rating: 'PG',
        vote_average: item.vote_average || 0,
        isTrending: true,
        isBookmarked: false,
      }));
      
      console.log(`Successfully fetched ${result.length} trending shows`);
      return result;
    } catch (error) {
      console.error('Error fetching trending shows:', error);
      throw new Error('Failed to fetch trending shows');
    }
  },

  // Search by keyword
  async searchByKeyword(query) {
    try {
      console.log(`Searching for "${query}"...`);
      const [movieResults, tvResults] = await Promise.all([
        tmdbApi.get(`/search/movie?query=${query}&include_adult=false&language=en-US&page=1`),
        tmdbApi.get(`/search/tv?query=${query}&include_adult=false&language=en-US&page=1`)
      ]);
      
      const movies = movieResults.data.results.map(movie => ({
        id: movie.id,
        title: movie.title,
        thumbnail: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        backdrop_path: movie.backdrop_path || '',
        year: movie.release_date ? new Date(movie.release_date).getFullYear() : 0,
        category: 'Movie',
        media_type: 'movie',
        rating: 'PG',
        vote_average: movie.vote_average || 0,
        isTrending: movie.popularity > 1000,
        isBookmarked: false,
      }));
      
      const tvShows = tvResults.data.results.map(series => ({
        id: series.id,
        title: series.name,
        thumbnail: `https://image.tmdb.org/t/p/w500${series.poster_path}`,
        backdrop_path: series.backdrop_path || '',
        year: series.first_air_date ? new Date(series.first_air_date).getFullYear() : 0,
        category: 'TV Series',
        media_type: 'tv',
        rating: 'PG',
        vote_average: series.vote_average || 0,
        isTrending: series.popularity > 1000,
        isBookmarked: false,
      }));
      
      const combinedResults = [...movies, ...tvShows];
      console.log(`Found ${combinedResults.length} results for "${query}"`);
      return combinedResults;
    } catch (error) {
      console.error('Error searching shows:', error);
      throw new Error('Failed to search shows');
    }
  }
};

// Log all requests for debugging
app.use((req, res, next) => {
  console.log(`[DEBUG] Received request: ${req.method} ${req.url}`);
  console.log(`[DEBUG] Request query:`, req.query);
  console.log(`[DEBUG] Request path:`, req.path);
  console.log(`[DEBUG] Request originalUrl:`, req.originalUrl);
  next();
});

// Import routes
const showsRouter = require('../dist/routes/shows');
const moviesRouter = require('../dist/routes/movies');
const tvRouter = require('../dist/routes/tv');
const searchRouter = require('../dist/routes/search');
const bookmarkedRouter = require('../dist/routes/bookmarked');
const authRouter = require('../dist/routes/auth');

// Add a test route to verify the API is working
app.get('/test', (req, res) => {
  res.json({ message: 'API is working' });
});

// Use modular routes
app.use('/', showsRouter);
app.use('/movies', moviesRouter);
app.use('/tv', tvRouter);
app.use('/search', searchRouter);
app.use('/bookmarked', bookmarkedRouter);
app.use('/auth', authRouter);

// Add a health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'API is running' });
});

// Add a catch-all route for debugging
app.use('*', (req, res) => {
  console.log(`[DEBUG] No route matched for ${req.method} ${req.originalUrl}`);
  
  res.status(404).json({
    status: false,
    error: {
      message: `Route not found: ${req.originalUrl}`,
      status: 404
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error in request:', err.stack);
  
  res.status(err.statusCode || 500).json({
    status: false,
    error: {
      message: err.message || 'Internal Server Error',
      status: err.statusCode || 500
    }
  });
});

// Wrap the Express app with serverless
const handler = serverless(app);

// Export the handler function
exports.handler = async (event, context) => {
  // Log the original request for debugging
  console.log(`API request received: ${event.httpMethod} ${event.path}`);
  console.log('Request headers:', JSON.stringify(event.headers));
  console.log('Request queryStringParameters:', JSON.stringify(event.queryStringParameters));
  
  // Modify the path to remove the Netlify function path prefix if it exists
  if (event.path.startsWith('/.netlify/functions/api')) {
    const originalPath = event.path;
    // Strip the function path prefix
    event.path = event.path.replace('/.netlify/functions/api', '') || '/';
    console.log(`Modified path from ${originalPath} to ${event.path}`);
  }
  
  // Special handling for empty paths - route to root
  if (event.path === '') {
    event.path = '/';
    console.log(`Empty path detected, routing to /`);
  }
  
  // Log the final normalized path
  console.log(`Final normalized path: ${event.path}`);
  
  // Wait for the response
  try {
    return await handler(event, context);

  } catch (error) {
    console.error('Error in handler:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({
        status: false,
        error: {
          message: 'Server error processing request',
          status: 500
        }
      })
    };
  }
}; 