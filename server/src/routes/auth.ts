import express, { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { IUser } from '../types/interface';

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a user
// @access  Public
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

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

// @route   POST /api/auth/login
// @desc    Login a user
// @access  Public
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

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

    const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret', {
      expiresIn: '1d',
    });

    // Return user data without password
    const userData: Partial<IUser> = {
      id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      isGuest: user.isGuest,
      isUser: user.isUser,
      isAuthenticated: user.isAuthenticated,
    };

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

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', async (req: Request, res: Response) => {
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
    
    // Get user
    const user = await User.findOne({ id: decoded.user.id });
    
    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found',
      });
    }

    // Return user data without password
    const userData: Partial<IUser> = {
      id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      isGuest: user.isGuest,
      isUser: user.isUser,
      isAuthenticated: user.isAuthenticated,
    };

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

// @route   POST /api/auth/logout
// @desc    Logout a user
// @access  Private
router.post('/logout', async (req: Request, res: Response) => {
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

export default router; 