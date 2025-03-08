import express, { Request, Response } from 'express';
import { tmdbService } from '../services/tmdb/tmdb.service';
import { ApiErrorClass } from '../types/apiResponseType';

const router = express.Router();

// Get all shows and trending
router.get('/', async (req: Request, res: Response) => {
  try {
    const [shows, trending] = await Promise.all([
      tmdbService.getAllShows(),
      tmdbService.getAllTrending()
    ]);
    
    res.json({
      status: 200,
      data: {
        shows,
        trending
      }
    });
  } catch (error) {
    console.error('Error fetching shows and trending:', error);
    res.status(500).json({
      status: 500,
      error: 'Failed to fetch shows and trending'
    });
  }
});

export default router;