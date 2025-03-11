import 'express';

// Extend the Request interface to include user
// This is used to add the user ID to the request object
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
      };
    }
  }
} 