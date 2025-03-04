// Import required dependencies
const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const axios = require('axios');

// Create an Express app
const app = express();

// Configure middleware
app.use(cors());
app.use(express.json());

// TMDB configuration
const TMDB_API_ACCESS_TOKEN = process.env.TMDB_API_ACCESS_TOKEN;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

const tmdbApi = axios.create({
  baseURL: TMDB_BASE_URL,
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${TMDB_API_ACCESS_TOKEN}`,
    'Content-Type': 'application/json',
  },
});

// Define routes
app.get('/', async (req, res) => {
  try {
    // Check if the trending query parameter is present
    const trending = req.query.trending === 'true';
    
    if (trending) {
      const response = await tmdbApi.get('/trending/all/day');
      res.json({
        status: true,
        data: { trending: response.data.results }
      });
    } else {
      const [moviesResponse, tvResponse] = await Promise.all([
        tmdbApi.get('/discover/movie?include_adult=false&language=en-US&page=1&sort_by=popularity.desc'),
        tmdbApi.get('/discover/tv?include_adult=false&include_null_first_air_dates=false&language=en-US&page=1&sort_by=popularity.desc')
      ]);
      
      const moviesReceived = moviesResponse.data.results.map((movie) => ({
        ...movie,
        media_type: 'movie',
      }));
      
      const tvReceived = tvResponse.data.results.map((series) => ({
        ...series,
        media_type: 'tv',
      }));
      
      const result = [...moviesReceived, ...tvReceived].sort(() => Math.random() - 0.5);
      
      res.json({
        status: true,
        data: { shows: result }
      });
    }
  } catch (error) {
    console.error('Error in root endpoint:', error);
    res.status(500).json({
      status: false,
      error: 'Internal server error',
      message: 'Error fetching shows'
    });
  }
});

app.get('/movies', async (req, res) => {
  try {
    const response = await tmdbApi.get('/discover/movie?include_adult=false&language=en-US&page=1&sort_by=popularity.desc');
    
    const result = response.data.results.map((movie) => ({
      ...movie,
      media_type: 'movie',
    }));
    
    res.json({
      status: true,
      data: { shows: result }
    });
  } catch (error) {
    console.error('Error fetching movies:', error);
    res.status(500).json({
      status: false,
      error: 'Internal server error',
      message: 'Error fetching movies'
    });
  }
});

app.get('/tv', async (req, res) => {
  try {
    const response = await tmdbApi.get('/discover/tv?include_adult=false&include_null_first_air_dates=false&language=en-US&page=1&sort_by=popularity.desc');
    
    const result = response.data.results.map((series) => ({
      ...series,
      media_type: 'tv',
    }));
    
    res.json({
      status: true,
      data: { shows: result }
    });
  } catch (error) {
    console.error('Error fetching TV series:', error);
    res.status(500).json({
      status: false,
      error: 'Internal server error',
      message: 'Error fetching TV series'
    });
  }
});

app.get('/search', async (req, res) => {
  try {
    const query = req.query.query;
    
    if (!query) {
      return res.status(400).json({
        status: false,
        error: 'Bad request',
        message: 'Query parameter is required'
      });
    }
    
    const [movieResults, tvResults] = await Promise.all([
      tmdbApi.get(`/search/movie?query=${query}&include_adult=false&language=en-US&page=1`),
      tmdbApi.get(`/search/tv?query=${query}&include_adult=false&language=en-US&page=1`)
    ]);
    
    const movies = movieResults.data.results.map((movie) => ({
      ...movie,
      media_type: 'movie',
    }));
    
    const tvShows = tvResults.data.results.map((series) => ({
      ...series,
      media_type: 'tv',
    }));
    
    const combinedResults = [...movies, ...tvShows];
    
    res.json({
      status: true,
      data: { shows: combinedResults }
    });
  } catch (error) {
    console.error('Error searching shows:', error);
    res.status(500).json({
      status: false,
      error: 'Internal server error',
      message: 'Error searching shows'
    });
  }
});

app.get('/bookmarked', (req, res) => {
  // Placeholder response
  res.json({
    status: true,
    data: { shows: [] }
  });
});

// Export the handler
module.exports.handler = serverless(app); 