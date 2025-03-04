const path = require('path');
const serverless = require('serverless-http');
const express = require('express');
const cors = require('cors');
const https = require('https');
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

// Create a simple HTTP request function using Node.js built-in https module
const makeHttpRequest = (url) => {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      let data = '';
      response.on('data', (chunk) => {
        data += chunk;
      });
      response.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
};

// Create axios instance for TMDB API
const tmdbApi = axios.create({
  baseURL: TMDB_BASE_URL,
  headers: TMDB_API_ACCESS_TOKEN
    ? {
        Authorization: `Bearer ${TMDB_API_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      }
    : {
        'Content-Type': 'application/json',
      },
  params: TMDB_API_KEY ? { api_key: TMDB_API_KEY } : {},
});

// TMDB service for fetching shows data
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
        name: movie.title || movie.name,
        thumbnail: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        backdrop_path: movie.backdrop_path,
        year: new Date(movie.release_date || movie.first_air_date).getFullYear(),
        category: 'Movie',
        media_type: 'movie',
        rating: 'PG',
        vote_average: movie.vote_average || 0,
        isTrending: movie.popularity > 1000,
        isBookmarked: false,
        isWatched: false,
        isFavorite: false,
        overview: movie.overview,
        genres: movie.genre_ids || [],
      }));

      const tvReceived = tvResponse.data.results.map(series => ({
        id: series.id,
        title: series.name || series.title,
        name: series.name || series.title,
        thumbnail: `https://image.tmdb.org/t/p/w500${series.poster_path}`,
        backdrop_path: series.backdrop_path,
        year: new Date(series.first_air_date || series.release_date).getFullYear(),
        category: 'TV Series',
        media_type: 'tv',
        rating: 'PG',
        vote_average: series.vote_average || 0,
        isTrending: series.popularity > 1000,
        isBookmarked: false,
        isWatched: false,
        isFavorite: false,
        overview: series.overview,
        genres: series.genre_ids || [],
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
        name: movie.title,
        thumbnail: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        backdrop_path: movie.backdrop_path,
        year: new Date(movie.release_date).getFullYear(),
        category: 'Movie',
        media_type: 'movie',
        rating: 'PG',
        vote_average: movie.vote_average || 0,
        isTrending: movie.popularity > 1000,
        isBookmarked: false,
        isWatched: false,
        isFavorite: false,
        overview: movie.overview,
        genres: movie.genre_ids || [],
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
        name: series.name,
        thumbnail: `https://image.tmdb.org/t/p/w500${series.poster_path}`,
        backdrop_path: series.backdrop_path,
        year: new Date(series.first_air_date).getFullYear(),
        category: 'TV Series',
        media_type: 'tv',
        rating: 'PG',
        vote_average: series.vote_average || 0,
        isTrending: series.popularity > 1000,
        isBookmarked: false,
        isWatched: false,
        isFavorite: false,
        overview: series.overview,
        genres: series.genre_ids || [],
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
        name: item.title || item.name,
        thumbnail: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
        backdrop_path: item.backdrop_path,
        year: new Date(item.release_date || item.first_air_date).getFullYear(),
        category: item.media_type === 'movie' ? 'Movie' : 'TV Series',
        media_type: item.media_type || 'movie',
        rating: 'PG',
        vote_average: item.vote_average || 0,
        isTrending: true,
        isBookmarked: false,
        isWatched: false,
        isFavorite: false,
        overview: item.overview,
        genres: item.genre_ids || [],
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
        name: movie.title,
        thumbnail: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        backdrop_path: movie.backdrop_path,
        year: movie.release_date ? new Date(movie.release_date).getFullYear() : 0,
        category: 'Movie',
        media_type: 'movie',
        rating: 'PG',
        vote_average: movie.vote_average || 0,
        isTrending: movie.popularity > 1000,
        isBookmarked: false,
        isWatched: false,
        isFavorite: false,
        overview: movie.overview,
        genres: movie.genre_ids || [],
      }));
      
      const tvShows = tvResults.data.results.map(series => ({
        id: series.id,
        title: series.name,
        name: series.name,
        thumbnail: `https://image.tmdb.org/t/p/w500${series.poster_path}`,
        backdrop_path: series.backdrop_path,
        year: series.first_air_date ? new Date(series.first_air_date).getFullYear() : 0,
        category: 'TV Series',
        media_type: 'tv',
        rating: 'PG',
        vote_average: series.vote_average || 0,
        isTrending: series.popularity > 1000,
        isBookmarked: false,
        isWatched: false,
        isFavorite: false,
        overview: series.overview,
        genres: series.genre_ids || [],
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

// Create Express app
const app = express();

// Configure CORS properly
app.use(cors({
  origin: ['https://emilia-burza-entertainment-app.netlify.app', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400
}));

// Parse JSON request body
app.use(express.json());

// Log requests for debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  console.log('Query:', req.query);
  console.log('Path:', req.path);
  console.log('Original URL:', req.originalUrl);
  
  // Set CORS headers manually to ensure they're applied
  res.header('Access-Control-Allow-Origin', 'https://emilia-burza-entertainment-app.netlify.app');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  next();
});

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is running' });
});

// Routes
app.get('/', async (req, res) => {
  try {
    console.log('GET / - Fetching trending and all shows');
    
    // Check if we're getting a trending request
    if (req.query.trending === 'true') {
      console.log('Fetching trending shows for root request with trending=true param');
      const trending = await tmdbService.getAllTrending();
      return res.json(trending);
    }
    
    const [trending, allShows] = await Promise.all([
      tmdbService.getAllTrending(),
      tmdbService.getAllShows()
    ]);
    
    res.json({
      trending,
      allShows
    });
  } catch (error) {
    console.error('Error in root route:', error);
    res.status(500).json({ error: 'Failed to fetch shows' });
  }
});

app.get('/movies', async (req, res) => {
  try {
    console.log('GET /movies - Fetching movies');
    const movies = await tmdbService.getMovies();
    console.log(`Returning ${movies.length} movies`);
    res.json(movies);
  } catch (error) {
    console.error('Error fetching movies:', error);
    res.status(500).json({ error: 'Failed to fetch movies' });
  }
});

app.get('/tv', async (req, res) => {
  try {
    console.log('GET /tv - Fetching TV series');
    const tvSeries = await tmdbService.getTvSeries();
    console.log(`Returning ${tvSeries.length} TV series`);
    res.json(tvSeries);
  } catch (error) {
    console.error('Error fetching TV series:', error);
    res.status(500).json({ error: 'Failed to fetch TV series' });
  }
});

app.get('/search', async (req, res) => {
  try {
    const { query } = req.query;
    console.log(`GET /search - Searching for "${query}"`);
    
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }
    
    const results = await tmdbService.searchByKeyword(query);
    console.log(`Returning ${results.length} search results`);
    res.json(results);
  } catch (error) {
    console.error('Error searching shows:', error);
    res.status(500).json({ error: 'Failed to search shows' });
  }
});

app.get('/bookmarked', async (req, res) => {
  try {
    console.log('GET /bookmarked - This endpoint is not fully implemented, returning empty array');
    res.json([]);
  } catch (error) {
    console.error('Error fetching bookmarked shows:', error);
    res.status(500).json({ error: 'Failed to fetch bookmarked shows' });
  }
});

// Catch-all route
app.use('*', (req, res) => {
  console.log(`Route not found: ${req.originalUrl}`);
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Server error', message: err.message });
});

// Export the handler function
const handler = serverless(app, {
  basePath: '/.netlify/functions/api',
});

// Handle function invocation
exports.handler = async (event, context) => {
  // Log the event for debugging
  console.log('Event path:', event.path);
  console.log('Event httpMethod:', event.httpMethod);
  console.log('Event headers:', JSON.stringify(event.headers));
  
  // Handle OPTIONS requests for CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': 'https://emilia-burza-entertainment-app.netlify.app',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Max-Age': '86400'
      },
      body: ''
    };
  }

  try {
    // Normalize the path
    if (event.path.includes('/.netlify/functions/api')) {
      // Strip the function path prefix if it exists
      event.path = event.path.replace('/.netlify/functions/api', '');
    }

    // Route empty paths to root
    if (event.path === '' || event.path === '/') {
      event.path = '/';
    }

    console.log('Normalized path:', event.path);
    
    // Call the serverless handler
    const response = await handler(event, context);
    
    // Ensure CORS headers are in the response
    if (!response.headers) {
      response.headers = {};
    }
    
    response.headers['Access-Control-Allow-Origin'] = 'https://emilia-burza-entertainment-app.netlify.app';
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS';
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
    response.headers['Access-Control-Allow-Credentials'] = 'true';
    
    return response;
  } catch (error) {
    console.error('Error in handler:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': 'https://emilia-burza-entertainment-app.netlify.app',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: 'Server error', message: error.message })
    };
  }
}; 