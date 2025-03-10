const path = require('path');
const serverless = require('serverless-http');
const express = require('express');
const cors = require('cors');
const https = require('https');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

// Set up environment variables
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

// Log environment variables for debugging (will be removed in production)
console.log('TMDB_BASE_URL:', process.env.TMDB_BASE_URL);
console.log('TMDB_API_ACCESS_TOKEN exists:', !!process.env.TMDB_API_ACCESS_TOKEN);
console.log('TMDB_API_KEY exists:', !!process.env.TMDB_API_KEY);
console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);

// Create TMDB service directly in this file to reduce dependencies
const TMDB_API_ACCESS_TOKEN = process.env.TMDB_API_ACCESS_TOKEN;
const TMDB_BASE_URL = process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3';
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://emilaburza:8ZDXKQl7IyJ1qtN4@cluster0.uzwcz.mongodb.net/';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

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

// Connect to MongoDB
const connectToDatabase = async () => {
  try {
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined');
    }
    
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB Atlas');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

// Define User Schema
const userSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true,
  },
  name: {
    type: String,
    index: true,
    required: true,
    minlength: 3,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
    unique: true,
    match: [
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'Please use a valid email address'
    ]
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 255
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  isGuest: {
    type: Boolean,
    default: false
  },
  isUser: {
    type: Boolean,
    default: true
  },
  isAuthenticated: {
    type: Boolean,
    default: false
  }
});

userSchema.index({ name: 'text' });
const User = mongoose.model('User', userSchema);

// Authentication Middleware
const auth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        status: 'fail',
        message: 'No token, authorization denied',
      });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Add user ID to request
    req.user = decoded.user;
    
    // Check if user exists
    const user = await User.findOne({ id: decoded.user.id });
    
    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found',
      });
    }
    
    // Check if user is authenticated
    if (!user.isAuthenticated) {
      return res.status(401).json({
        status: 'fail',
        message: 'User is not authenticated',
      });
    }
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({
      status: 'fail',
      message: 'Token is not valid',
    });
  }
};

// Create TMDB API client
const tmdbApi = {
  get: async (endpoint) => {
    const url = `${TMDB_BASE_URL}${endpoint}`;
    return makeHttpRequest(url);
  }
};

// Create the TMDB service
const tmdbService = {
  getShows: async () => {
    try {
      const url = `${TMDB_BASE_URL}/trending/all/week?language=en-US&api_key=${TMDB_API_KEY}`;
      const response = await makeHttpRequest(url);
      return response.data.results.map(show => ({
        id: show.id.toString(),
        title: show.title || show.name,
        backdrop_path: show.backdrop_path,
        year: new Date(show.release_date || show.first_air_date).getFullYear() || 0,
        media_type: show.media_type,
        vote_average: show.vote_average,
        isTrending: true,
        isBookmarked: false
      }));
    } catch (error) {
      console.error('Error getting shows:', error);
      throw new Error('Failed to get shows');
    }
  },
  
  getMovies: async () => {
    try {
      const url = `${TMDB_BASE_URL}/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&api_key=${TMDB_API_KEY}`;
      const response = await makeHttpRequest(url);
      return response.data.results.map(movie => ({
        id: movie.id.toString(),
        title: movie.title,
        backdrop_path: movie.backdrop_path,
        year: new Date(movie.release_date).getFullYear() || 0,
        media_type: 'movie',
        vote_average: movie.vote_average,
        isTrending: false,
        isBookmarked: false
      }));
    } catch (error) {
      console.error('Error getting movies:', error);
      throw new Error('Failed to get movies');
    }
  },
  
  getTvSeries: async () => {
    try {
      const url = `${TMDB_BASE_URL}/discover/tv?include_adult=false&include_null_first_air_dates=false&language=en-US&page=1&sort_by=popularity.desc&api_key=${TMDB_API_KEY}`;
      const response = await makeHttpRequest(url);
      return response.data.results.map(tv => ({
        id: tv.id.toString(),
        title: tv.name,
        backdrop_path: tv.backdrop_path,
        year: new Date(tv.first_air_date).getFullYear() || 0,
        media_type: 'tv',
        vote_average: tv.vote_average,
        isTrending: false,
        isBookmarked: false
      }));
    } catch (error) {
      console.error('Error getting TV series:', error);
      throw new Error('Failed to get TV series');
    }
  },
  
  searchByKeyword: async (query) => {
    try {
      const url = `${TMDB_BASE_URL}/search/multi?query=${encodeURIComponent(query)}&include_adult=false&language=en-US&page=1&api_key=${TMDB_API_KEY}`;
      const response = await makeHttpRequest(url);
      
      // Filter only movie and tv results
      const filteredResults = response.data.results.filter(
        item => item.media_type === 'movie' || item.media_type === 'tv'
      );
      
      return filteredResults.map(item => ({
        id: item.id.toString(),
        title: item.title || item.name,
        backdrop_path: item.backdrop_path,
        year: new Date(item.release_date || item.first_air_date).getFullYear() || 0,
        media_type: item.media_type,
        vote_average: item.vote_average,
        isTrending: false,
        isBookmarked: false
      }));
    } catch (error) {
      console.error('Error searching by keyword:', error);
      throw new Error('Failed to search by keyword');
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

// TMDB Routes
app.get('/', async (req, res) => {
  console.log('[DEBUG] Root endpoint hit with query:', req.query);
  try {
    if (req.query.trending === 'true') {
      const trendingShows = await tmdbService.getShows();
      return res.json({ 
        status: true, 
        data: { 
          trending: trendingShows
        } 
      });
    }
    
    const shows = await tmdbService.getShows();
    return res.json({ 
      status: true, 
      data: { 
        shows 
      } 
    });
  } catch (error) {
    console.error('Error in root route:', error);
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

// Authentication Routes

// @route   POST /.netlify/functions/api/auth/register
// @desc    Register a user
// @access  Public
app.post('/.netlify/functions/api/auth/register', async (req, res) => {
  try {
    // Connect to MongoDB if not already connected
    if (!isConnected) {
      await connectToDatabase();
      isConnected = true;
    }
    
    console.log('[DEBUG] Register endpoint hit');
    const { name, email, password } = req.body;
    
    // Validate request
    if (!name || !email || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide name, email, and password',
      });
    }
    
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        status: 'fail',
        message: 'User already exists',
      });
    }

    // Create new user
    const userId = uuidv4();
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      id: userId,
      name,
      email,
      password: hashedPassword,
      isAdmin: false,
      isGuest: false,
      isUser: true,
      isAuthenticated: false,
    });

    await user.save();
    console.log('[DEBUG] User registered successfully');

    return res.status(201).json({
      status: 'success',
      data: {
        success: true,
        message: 'User registered successfully',
      },
    });
  } catch (error) {
    console.error('Error in register route:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Server error',
    });
  }
});

// Also define it at the shorter path to handle cases where the path is correctly modified
app.post('/auth/register', async (req, res) => {
  try {
    // Connect to MongoDB if not already connected
    if (!isConnected) {
      await connectToDatabase();
      isConnected = true;
    }
    
    console.log('[DEBUG] Register endpoint hit (short path)');
    const { name, email, password } = req.body;
    
    // Validate request
    if (!name || !email || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide name, email, and password',
      });
    }
    
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        status: 'fail',
        message: 'User already exists',
      });
    }

    // Create new user
    const userId = uuidv4();
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      id: userId,
      name,
      email,
      password: hashedPassword,
      isAdmin: false,
      isGuest: false,
      isUser: true,
      isAuthenticated: false,
    });

    await user.save();
    console.log('[DEBUG] User registered successfully');

    return res.status(201).json({
      status: 'success',
      data: {
        success: true,
        message: 'User registered successfully',
      },
    });
  } catch (error) {
    console.error('Error in register route:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Server error',
    });
  }
});

// @route   POST /.netlify/functions/api/auth/login
// @desc    Login a user
// @access  Public
app.post('/.netlify/functions/api/auth/login', async (req, res) => {
  try {
    // Connect to MongoDB if not already connected
    if (!isConnected) {
      await connectToDatabase();
      isConnected = true;
    }
    
    console.log('[DEBUG] Login endpoint hit (full path)');
    const { email, password } = req.body;

    // Validate request
    if (!email || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide email and password',
      });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid credentials',
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid credentials',
      });
    }

    // Update user authentication status
    user.isAuthenticated = true;
    await user.save();

    // Create JWT token
    const payload = {
      user: {
        id: user.id,
      },
    };

    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: '1d',
    });

    // Return user data without password
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      isGuest: user.isGuest,
      isUser: user.isUser,
      isAuthenticated: user.isAuthenticated,
    };

    console.log('[DEBUG] User logged in successfully');
    return res.status(200).json({
      status: 'success',
      data: {
        user: userData,
        token,
      },
    });
  } catch (error) {
    console.error('Error in login route:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Server error',
    });
  }
});

// Also define login at shorter path
app.post('/auth/login', async (req, res) => {
  try {
    // Connect to MongoDB if not already connected
    if (!isConnected) {
      await connectToDatabase();
      isConnected = true;
    }
    
    console.log('[DEBUG] Login endpoint hit (short path)');
    const { email, password } = req.body;

    // Validate request
    if (!email || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide email and password',
      });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid credentials',
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid credentials',
      });
    }

    // Update user authentication status
    user.isAuthenticated = true;
    await user.save();

    // Create JWT token
    const payload = {
      user: {
        id: user.id,
      },
    };

    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: '1d',
    });

    // Return user data without password
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      isGuest: user.isGuest,
      isUser: user.isUser,
      isAuthenticated: user.isAuthenticated,
    };

    console.log('[DEBUG] User logged in successfully');
    return res.status(200).json({
      status: 'success',
      data: {
        user: userData,
        token,
      },
    });
  } catch (error) {
    console.error('Error in login route:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Server error',
    });
  }
});

// @route   GET /.netlify/functions/api/auth/me
// @desc    Get current user
// @access  Private
app.get('/.netlify/functions/api/auth/me', async (req, res) => {
  try {
    // Connect to MongoDB if not already connected
    if (!isConnected) {
      await connectToDatabase();
      isConnected = true;
    }
    
    console.log('[DEBUG] Get current user endpoint hit (full path)');
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        status: 'fail',
        message: 'No token, authorization denied',
      });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Get user
    const user = await User.findOne({ id: decoded.user.id });
    
    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found',
      });
    }

    // Return user data without password
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      isGuest: user.isGuest,
      isUser: user.isUser,
      isAuthenticated: user.isAuthenticated,
    };

    console.log('[DEBUG] Current user retrieved successfully');
    return res.status(200).json({
      status: 'success',
      data: {
        user: userData,
      },
    });
  } catch (error) {
    console.error('Error in get current user route:', error);
    return res.status(401).json({
      status: 'fail',
      message: 'Token is not valid',
    });
  }
});

// Also define get current user at shorter path
app.get('/auth/me', async (req, res) => {
  try {
    // Connect to MongoDB if not already connected
    if (!isConnected) {
      await connectToDatabase();
      isConnected = true;
    }
    
    console.log('[DEBUG] Get current user endpoint hit (short path)');
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        status: 'fail',
        message: 'No token, authorization denied',
      });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Get user
    const user = await User.findOne({ id: decoded.user.id });
    
    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found',
      });
    }

    // Return user data without password
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      isGuest: user.isGuest,
      isUser: user.isUser,
      isAuthenticated: user.isAuthenticated,
    };

    console.log('[DEBUG] Current user retrieved successfully');
    return res.status(200).json({
      status: 'success',
      data: {
        user: userData,
      },
    });
  } catch (error) {
    console.error('Error in get current user route:', error);
    return res.status(401).json({
      status: 'fail',
      message: 'Token is not valid',
    });
  }
});

// @route   POST /.netlify/functions/api/auth/logout
// @desc    Logout a user
// @access  Private
app.post('/.netlify/functions/api/auth/logout', async (req, res) => {
  try {
    // Connect to MongoDB if not already connected
    if (!isConnected) {
      await connectToDatabase();
      isConnected = true;
    }
    
    console.log('[DEBUG] Logout endpoint hit (full path)');
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        status: 'fail',
        message: 'No token, authorization denied',
      });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Get user
    const user = await User.findOne({ id: decoded.user.id });
    
    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found',
      });
    }

    // Update user authentication status
    user.isAuthenticated = false;
    await user.save();

    console.log('[DEBUG] User logged out successfully');
    return res.status(200).json({
      status: 'success',
      data: {
        message: 'User logged out successfully',
      },
    });
  } catch (error) {
    console.error('Error in logout route:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Server error',
    });
  }
});

// Also define logout at shorter path
app.post('/auth/logout', async (req, res) => {
  try {
    // Connect to MongoDB if not already connected
    if (!isConnected) {
      await connectToDatabase();
      isConnected = true;
    }
    
    console.log('[DEBUG] Logout endpoint hit (short path)');
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        status: 'fail',
        message: 'No token, authorization denied',
      });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Get user
    const user = await User.findOne({ id: decoded.user.id });
    
    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found',
      });
    }

    // Update user authentication status
    user.isAuthenticated = false;
    await user.save();

    console.log('[DEBUG] User logged out successfully');
    return res.status(200).json({
      status: 'success',
      data: {
        message: 'User logged out successfully',
      },
    });
  } catch (error) {
    console.error('Error in logout route:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Server error',
    });
  }
});

// Wrap the Express app with serverless
const handler = serverless(app);

// Export the handler function
exports.handler = async (event, context) => {
  // Log the original request for debugging
  console.log(`API request received: ${event.httpMethod} ${event.path}`);
  console.log('Request headers:', JSON.stringify(event.headers));
  console.log('Request queryStringParameters:', JSON.stringify(event.queryStringParameters));
  
  try {
    // Do not modify the path - let the serverless handler manage path routing
    // This was causing auth routes to not be found correctly
    
    // Wait for the response
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