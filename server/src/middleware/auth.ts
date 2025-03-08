import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

// Extend the Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
      };
    }
  }
}

/**
 * Authentication middleware
 * Verifies the JWT token and adds the user ID to the request
 */
const auth = async (req: Request, res: Response, next: NextFunction) => {
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
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as { user: { id: string } };
    
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

export default auth; 