import cors from 'cors';

// Configure CORS
export const corsMiddleware = cors({
  origin: [
    'https://emilia-burza-entertainment-app.netlify.app', 
    'http://localhost:3000'  // For local development
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
  credentials: true,
  maxAge: 86400
});

export default corsMiddleware;
