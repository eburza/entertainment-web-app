import express, { Request, Response } from 'express';
import { tmdbService } from '../services/tmdb/tmdb.service';
import { ApiErrorClass } from '../types/apiResponseType';

const router = express.Router();

// Search shows
router.get('/', async (req: Request, res: Response) => {
  try {
    const { query } = req.query;
    if (!query || typeof query !== 'string') {
      throw new ApiErrorClass('Search query is required', 400);
    }
    const results = await tmdbService.searchByKeyword(query);
    res.json({
      status: 200,
      data: results
    });
  } catch (error) {
    throw new ApiErrorClass('Failed to search shows', 500);
  }
});

export default router;