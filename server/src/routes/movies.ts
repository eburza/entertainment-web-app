import express, { Request, Response } from 'express';
import { tmdbService } from '../services/tmdb/tmdb.service';
import { ApiErrorClass } from '../types/apiResponseType';

const router = express.Router();

// @route   GET /api/movies
// @desc    Get all movies
// @access  Public
router.get('/', async (req: Request, res: Response) => {
  try {
    const movies = await tmdbService.getMovies();
    res.json({
      status: 200,
      data: movies
    });
  } catch (error) {
    console.error('Error fetching movies:', error);
    res.status(500).json({
      status: 500,
      error: 'Failed to fetch movies'
    });
  }
});

export default router;