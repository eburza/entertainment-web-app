const path = require('path');
const serverless = require('serverless-http');
const express = require('express');
const cors = require('cors');

// Set up environment variables
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

// Import routes
let showsRouter, bookmarkedRouter, tvRouter, moviesRouter, searchRouter;

try {
  // Import routes from the build directory
  showsRouter = require('../../dist/routes/shows').default;
  bookmarkedRouter = require('../../dist/routes/bookmarked').default;
  tvRouter = require('../../dist/routes/tv').default;
  moviesRouter = require('../../dist/routes/movies').default;
  searchRouter = require('../../dist/routes/search').default;
} catch (error) {
  console.error('Error importing routes:', error);
  // Fallback to mock routes if imports fail
  const mockRouter = express.Router();
  
  mockRouter.get('/', (req, res) => {
    if (req.query.trending === 'true') {
      return res.json({ 
        status: true, 
        data: { 
          trending: [
            { id: 'tr1', title: 'Trending Show 1', category: 'Movie', isTrending: true, rating: 'PG', year: 2023, thumbnail: '/placeholder.jpg' },
            { id: 'tr2', title: 'Trending Show 2', category: 'TV Series', isTrending: true, rating: 'PG-13', year: 2024, thumbnail: '/placeholder.jpg' }
          ]
        } 
      });
    }
    
    return res.json({ 
      status: true, 
      data: { 
        shows: [
          { id: '1', title: 'Default Show 1', category: 'Movie', isTrending: false, rating: 'PG', year: 2023, thumbnail: '/placeholder.jpg' },
          { id: '2', title: 'Default Show 2', category: 'TV Series', isTrending: true, rating: 'PG-13', year: 2024, thumbnail: '/placeholder.jpg' }
        ]
      } 
    });
  });
  
  mockRouter.get('/movies', (req, res) => {
    res.json({ 
      status: true, 
      data: { 
        shows: [
          { id: 'm1', title: 'Mock Movie 1', category: 'Movie', isTrending: false, rating: 'PG', year: 2023, thumbnail: '/placeholder.jpg' },
          { id: 'm2', title: 'Mock Movie 2', category: 'Movie', isTrending: true, rating: 'PG-13', year: 2024, thumbnail: '/placeholder.jpg' }
        ]
      } 
    });
  });
  
  mockRouter.get('/tv', (req, res) => {
    res.json({ 
      status: true, 
      data: { 
        shows: [
          { id: 't1', title: 'Mock TV Show 1', category: 'TV Series', isTrending: false, rating: 'PG', year: 2023, thumbnail: '/placeholder.jpg' },
          { id: 't2', title: 'Mock TV Show 2', category: 'TV Series', isTrending: true, rating: 'PG-13', year: 2024, thumbnail: '/placeholder.jpg' }
        ]
      } 
    });
  });
  
  mockRouter.get('/search', (req, res) => {
    res.json({ 
      status: true, 
      data: { 
        shows: [
          { id: 's1', title: 'Search Result 1', category: 'Movie', isTrending: false, rating: 'PG', year: 2023, thumbnail: '/placeholder.jpg' },
          { id: 's2', title: 'Search Result 2', category: 'TV Series', isTrending: false, rating: 'PG-13', year: 2024, thumbnail: '/placeholder.jpg' }
        ]
      } 
    });
  });
  
  mockRouter.get('/bookmarked', (req, res) => {
    res.json({ 
      status: true, 
      data: { 
        shows: [
          { id: 'b1', title: 'Bookmarked Show 1', category: 'Movie', isTrending: false, rating: 'PG', year: 2023, thumbnail: '/placeholder.jpg', isBookmarked: true },
          { id: 'b2', title: 'Bookmarked Show 2', category: 'TV Series', isTrending: false, rating: 'PG-13', year: 2024, thumbnail: '/placeholder.jpg', isBookmarked: true }
        ]
      } 
    });
  });
  
  showsRouter = mockRouter;
  bookmarkedRouter = mockRouter;
  tvRouter = mockRouter;
  moviesRouter = mockRouter;
  searchRouter = mockRouter;
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