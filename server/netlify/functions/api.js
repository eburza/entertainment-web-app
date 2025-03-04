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

      // Fetch genre lists to map IDs to names
      const [movieGenres, tvGenres] = await Promise.all([
        tmdbApi.get('/genre/movie/list'),
        tmdbApi.get('/genre/tv/list')
      ]);

      const movieGenreMap = movieGenres.data.genres.reduce((map, genre) => {
        map[genre.id] = genre.name;
        return map;
      }, {});

      const tvGenreMap = tvGenres.data.genres.reduce((map, genre) => {
        map[genre.id] = genre.name;
        return map;
      }, {});

      const moviesReceived = await Promise.all(moviesResponse.data.results.map(async movie => {
        // Fetch videos for the movie
        let videoKey = null;
        try {
          const videosResponse = await tmdbApi.get(`/movie/${movie.id}/videos`);
          const trailer = videosResponse.data.results.find(video => video.type === 'Trailer' && video.site === 'YouTube');
          videoKey = trailer ? trailer.key : null;
        } catch (error) {
          console.error(`Error fetching videos for movie ${movie.id}:`, error);
        }

        return {
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
          genres: movie.genre_ids.map(id => movieGenreMap[id] || 'Unknown'),
          video_key: videoKey,
        };
      }));

      const tvReceived = await Promise.all(tvResponse.data.results.map(async series => {
        // Fetch videos for the TV series
        let videoKey = null;
        try {
          const videosResponse = await tmdbApi.get(`/tv/${series.id}/videos`);
          const trailer = videosResponse.data.results.find(video => video.type === 'Trailer' && video.site === 'YouTube');
          videoKey = trailer ? trailer.key : null;
        } catch (error) {
          console.error(`Error fetching videos for TV series ${series.id}:`, error);
        }

        return {
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
          genres: series.genre_ids.map(id => tvGenreMap[id] || 'Unknown'),
          video_key: videoKey,
        };
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
      
      // Fetch movie genres
      const genresResponse = await tmdbApi.get('/genre/movie/list');
      const genreMap = genresResponse.data.genres.reduce((map, genre) => {
        map[genre.id] = genre.name;
        return map;
      }, {});
      
      const result = await Promise.all(response.data.results.map(async movie => {
        // Fetch videos for the movie
        let videoKey = null;
        try {
          const videosResponse = await tmdbApi.get(`/movie/${movie.id}/videos`);
          const trailer = videosResponse.data.results.find(video => video.type === 'Trailer' && video.site === 'YouTube');
          videoKey = trailer ? trailer.key : null;
        } catch (error) {
          console.error(`Error fetching videos for movie ${movie.id}:`, error);
        }
        
        return {
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
          genres: movie.genre_ids.map(id => genreMap[id] || 'Unknown'),
          video_key: videoKey,
        };
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
      
      // Fetch TV genres
      const genresResponse = await tmdbApi.get('/genre/tv/list');
      const genreMap = genresResponse.data.genres.reduce((map, genre) => {
        map[genre.id] = genre.name;
        return map;
      }, {});
      
      return await Promise.all(response.data.results.map(async series => {
        // Fetch videos for the TV series
        let videoKey = null;
        try {
          const videosResponse = await tmdbApi.get(`/tv/${series.id}/videos`);
          const trailer = videosResponse.data.results.find(video => video.type === 'Trailer' && video.site === 'YouTube');
          videoKey = trailer ? trailer.key : null;
        } catch (error) {
          console.error(`Error fetching videos for TV series ${series.id}:`, error);
        }
        
        return {
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
          genres: series.genre_ids.map(id => genreMap[id] || 'Unknown'),
          video_key: videoKey,
        };
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
      
      // Fetch both movie and TV genres
      const [movieGenres, tvGenres] = await Promise.all([
        tmdbApi.get('/genre/movie/list'),
        tmdbApi.get('/genre/tv/list')
      ]);
      
      const movieGenreMap = movieGenres.data.genres.reduce((map, genre) => {
        map[genre.id] = genre.name;
        return map;
      }, {});
      
      const tvGenreMap = tvGenres.data.genres.reduce((map, genre) => {
        map[genre.id] = genre.name;
        return map;
      }, {});
      
      const result = await Promise.all(response.data.results.map(async item => {
        // Fetch videos based on media type
        let videoKey = null;
        try {
          const videosResponse = await tmdbApi.get(`/${item.media_type}/${item.id}/videos`);
          const trailer = videosResponse.data.results.find(video => video.type === 'Trailer' && video.site === 'YouTube');
          videoKey = trailer ? trailer.key : null;
        } catch (error) {
          console.error(`Error fetching videos for ${item.media_type} ${item.id}:`, error);
        }
        
        // Use appropriate genre map based on media type
        const genreMap = item.media_type === 'movie' ? movieGenreMap : tvGenreMap;
        
        return {
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
          genres: item.genre_ids.map(id => genreMap[id] || 'Unknown'),
          video_key: videoKey,
        };
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
      
      // Fetch both movie and TV genres
      const [movieGenres, tvGenres] = await Promise.all([
        tmdbApi.get('/genre/movie/list'),
        tmdbApi.get('/genre/tv/list')
      ]);
      
      const movieGenreMap = movieGenres.data.genres.reduce((map, genre) => {
        map[genre.id] = genre.name;
        return map;
      }, {});
      
      const tvGenreMap = tvGenres.data.genres.reduce((map, genre) => {
        map[genre.id] = genre.name;
        return map;
      }, {});
      
      const movies = await Promise.all(movieResults.data.results.map(async movie => {
        // Fetch videos for the movie
        let videoKey = null;
        try {
          const videosResponse = await tmdbApi.get(`/movie/${movie.id}/videos`);
          const trailer = videosResponse.data.results.find(video => video.type === 'Trailer' && video.site === 'YouTube');
          videoKey = trailer ? trailer.key : null;
        } catch (error) {
          console.error(`Error fetching videos for movie ${movie.id}:`, error);
        }
        
        return {
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
          genres: movie.genre_ids ? movie.genre_ids.map(id => movieGenreMap[id] || 'Unknown') : [],
          video_key: videoKey,
        };
      }));
      
      const tvShows = await Promise.all(tvResults.data.results.map(async series => {
        // Fetch videos for the TV series
        let videoKey = null;
        try {
          const videosResponse = await tmdbApi.get(`/tv/${series.id}/videos`);
          const trailer = videosResponse.data.results.find(video => video.type === 'Trailer' && video.site === 'YouTube');
          videoKey = trailer ? trailer.key : null;
        } catch (error) {
          console.error(`Error fetching videos for TV series ${series.id}:`, error);
        }
        
        return {
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
          genres: series.genre_ids ? series.genre_ids.map(id => tvGenreMap[id] || 'Unknown') : [],
          video_key: videoKey,
        };
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

// Log all requests for debugging
app.use((req, res, next) => {
  console.log(`[DEBUG] Received request: ${req.method} ${req.url}`);
  console.log(`[DEBUG] Request query:`, req.query);
  console.log(`[DEBUG] Request path:`, req.path);
  console.log(`[DEBUG] Request originalUrl:`, req.originalUrl);
  next();
});

// Add a simple test route to verify the API is working
app.get('/test', (req, res) => {
  res.json({ message: 'API is working' });
});

// Mount routers directly on the app for simplicity rather than using a nested router
// This avoids potential path matching issues
app.get('/', async (req, res) => {
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

app.get('/movies', async (req, res) => {
  console.log('[DEBUG] Movies endpoint hit');
  try {
    const movies = await tmdbService.getMovies();
    console.log(`[DEBUG] Movies fetched successfully: ${movies.length} items`);
    return res.json({ 
      status: true, 
      data: { 
        shows: movies
      } 
    });
  } catch (error) {
    console.error('Error in movies route:', error);
    return res.status(500).json({ 
      status: false, 
      error: { 
        message: 'Failed to fetch movies', 
        status: 500 
      } 
    });
  }
});

app.get('/tv', async (req, res) => {
  console.log('[DEBUG] TV endpoint hit');
  try {
    const tvSeries = await tmdbService.getTvSeries();
    console.log(`[DEBUG] TV series fetched successfully: ${tvSeries.length} items`);
    return res.json({ 
      status: true, 
      data: { 
        shows: tvSeries
      } 
    });
  } catch (error) {
    console.error('Error in TV route:', error);
    return res.status(500).json({ 
      status: false, 
      error: { 
        message: 'Failed to fetch TV series', 
        status: 500 
      } 
    });
  }
});

app.get('/search', async (req, res) => {
  console.log('[DEBUG] Search endpoint hit with query:', req.query.query);
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
    console.log(`[DEBUG] Search results: ${searchResults.length} items found`);
    return res.json({ 
      status: true, 
      data: { 
        shows: searchResults
      } 
    });
  } catch (error) {
    console.error('Error in search route:', error);
    return res.status(500).json({ 
      status: false, 
      error: { 
        message: 'Failed to search shows', 
        status: 500 
      } 
    });
  }
});

app.get('/bookmarked', (req, res) => {
  console.log('[DEBUG] Bookmarked endpoint hit');
  return res.json({ 
    status: true, 
    data: { 
      shows: []
    } 
  });
});

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

// Remove the router configuration since we're mounting routes directly on the app
// This removes one layer of complexity in the routing
// router.use('/', showsRouter);
// router.use('/bookmarked', bookmarkedRouter);
// router.use('/tv', tvRouter);
// router.use('/movies', moviesRouter);
// router.use('/search', searchRouter);

// // Mount the router on multiple paths to handle different client configurations
// app.use('/', router);                        // Direct root access
// app.use('/.netlify/functions/api', router);  // Netlify function path

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
  // This is necessary because Netlify functions receive requests at /.netlify/functions/api
  // but our code expects paths like /movies, /tv, etc.
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