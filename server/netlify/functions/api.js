const path = require('path');
const serverless = require('serverless-http');
const express = require('express');
const cors = require('cors');
const axios = require('axios');

// Set up environment variables
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

// Log environment variables for debugging (will be removed in production)
console.log('TMDB_BASE_URL:', process.env.TMDB_BASE_URL);
console.log('TMDB_API_ACCESS_TOKEN exists:', !!process.env.TMDB_API_ACCESS_TOKEN);
console.log('TMDB_API_KEY exists:', !!process.env.TMDB_API_KEY);

// Create TMDB service directly in this file to reduce dependencies
const TMDB_API_ACCESS_TOKEN = process.env.TMDB_API_ACCESS_TOKEN;
const TMDB_BASE_URL = process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3';
const TMDB_API_KEY = process.env.TMDB_API_KEY;

// Create the axios instance for TMDB
const tmdbApi = axios.create({
  baseURL: TMDB_BASE_URL,
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${TMDB_API_ACCESS_TOKEN}`,
    'Content-Type': 'application/json',
  },
});

// Simple TMDB service
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
        year: new Date(movie.release_date || movie.first_air_date).getFullYear(),
        category: 'Movie',
        rating: 'PG',
        isTrending: movie.popularity > 1000,
        isBookmarked: false,
      }));

      const tvReceived = tvResponse.data.results.map(series => ({
        id: series.id,
        title: series.name || series.title,
        thumbnail: `https://image.tmdb.org/t/p/w500${series.poster_path}`,
        year: new Date(series.first_air_date || series.release_date).getFullYear(),
        category: 'TV Series',
        rating: 'PG',
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
        year: new Date(movie.release_date).getFullYear(),
        category: 'Movie',
        rating: 'PG',
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
        year: new Date(series.first_air_date).getFullYear(),
        category: 'TV Series',
        rating: 'PG',
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
        year: new Date(item.release_date || item.first_air_date).getFullYear(),
        category: item.media_type === 'movie' ? 'Movie' : 'TV Series',
        rating: 'PG',
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
        year: movie.release_date ? new Date(movie.release_date).getFullYear() : 0,
        category: 'Movie',
        rating: 'PG',
        isTrending: movie.popularity > 1000,
        isBookmarked: false,
      }));
      
      const tvShows = tvResults.data.results.map(series => ({
        id: series.id,
        title: series.name,
        thumbnail: `https://image.tmdb.org/t/p/w500${series.poster_path}`,
        year: series.first_air_date ? new Date(series.first_air_date).getFullYear() : 0,
        category: 'TV Series',
        rating: 'PG',
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

// Import routes or create basic routes
let showsRouter, bookmarkedRouter, tvRouter, moviesRouter, searchRouter;

try {
  // Try to import routes from the build directory
  showsRouter = require('../../dist/routes/shows').default;
  bookmarkedRouter = require('../../dist/routes/bookmarked').default;
  tvRouter = require('../../dist/routes/tv').default;
  moviesRouter = require('../../dist/routes/movies').default;
  searchRouter = require('../../dist/routes/search').default;
  console.log('Successfully imported routes from build directory');
} catch (error) {
  console.error('Error importing routes:', error);
  // Create basic routes that use the TMDB service directly
  console.log('Creating basic routes with TMDB service');
  
  // Shows router
  showsRouter = express.Router();
  showsRouter.get('/', async (req, res) => {
    try {
      if (req.query.trending === 'true') {
        const trendingShows = await tmdbService.getAllTrending();
        return res.json({ 
          status: true, 
          data: { 
            trending: trendingShows
          } 
        });
      }
      
      const shows = await tmdbService.getAllShows();
      return res.json({ 
        status: true, 
        data: { 
          shows: shows
        } 
      });
    } catch (error) {
      console.error('Error in shows route:', error);
      return res.status(500).json({ 
        status: false, 
        error: { 
          message: 'Failed to fetch shows', 
          status: 500 
        } 
      });
    }
  });
  
  // Movies router
  moviesRouter = express.Router();
  moviesRouter.get('/', async (req, res) => {
    try {
      const movies = await tmdbService.getMovies();
      res.json({ 
        status: true, 
        data: { 
          shows: movies
        } 
      });
    } catch (error) {
      console.error('Error in movies route:', error);
      res.status(500).json({ 
        status: false, 
        error: { 
          message: 'Failed to fetch movies', 
          status: 500 
        } 
      });
    }
  });
  
  // TV router
  tvRouter = express.Router();
  tvRouter.get('/', async (req, res) => {
    try {
      const tvSeries = await tmdbService.getTvSeries();
      res.json({ 
        status: true, 
        data: { 
          shows: tvSeries
        } 
      });
    } catch (error) {
      console.error('Error in TV route:', error);
      res.status(500).json({ 
        status: false, 
        error: { 
          message: 'Failed to fetch TV series', 
          status: 500 
        } 
      });
    }
  });
  
  // Search router
  searchRouter = express.Router();
  searchRouter.get('/', async (req, res) => {
    try {
      const { query } = req.query;
      if (!query) {
        return res.status(400).json({ 
          status: false, 
          error: { 
            message: 'Query parameter is required', 
            status: 400 
          } 
        });
      }
      
      const searchResults = await tmdbService.searchByKeyword(query);
      res.json({ 
        status: true, 
        data: { 
          shows: searchResults
        } 
      });
    } catch (error) {
      console.error('Error in search route:', error);
      res.status(500).json({ 
        status: false, 
        error: { 
          message: 'Failed to search shows', 
          status: 500 
        } 
      });
    }
  });
  
  // Bookmarked router (placeholder)
  bookmarkedRouter = express.Router();
  bookmarkedRouter.get('/', (req, res) => {
    res.json({ 
      status: true, 
      data: { 
        shows: []
      } 
    });
  });
}

// Create Express app
const app = express();

// Configure CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
  credentials: true,
  maxAge: 86400
}));

// Middleware
app.use(express.json());

// Routes
app.use('/', showsRouter);
app.use('/bookmarked', bookmarkedRouter);
app.use('/tv', tvRouter);
app.use('/movies', moviesRouter);
app.use('/search', searchRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    status: false,
    error: {
      message: err.message || 'Internal Server Error',
      status: err.statusCode || 500
    }
  });
});

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'API is running' });
});

// Wrap the Express app with serverless
const handler = serverless(app);

// Export the handler function
exports.handler = async (event, context) => {
  // Log the request for debugging
  console.log(`API request: ${event.httpMethod} ${event.path}`);
  
  // Wait for the response
  return await handler(event, context);
}; 