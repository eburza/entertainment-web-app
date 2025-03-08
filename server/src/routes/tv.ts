import express, { Request, Response } from 'express';
import { tmdbService } from '../services/tmdb/tmdb.service';
import { ApiErrorClass } from '../types/apiResponseType';

const router = express.Router();

// Get TV series only
router.get('/', async (req: Request, res: Response) => {
  try {
    const tvSeries = await tmdbService.getTvSeries();
    res.json({
      status: 200,
      data: tvSeries
    });
  } catch (error) {
    console.error('Error fetching TV series:', error);
    res.status(500).json({
      status: 500,
      error: 'Failed to fetch TV series'
    });
  }
});

export default router;