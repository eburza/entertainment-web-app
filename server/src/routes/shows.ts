import { Show } from '../models/Show';
import express, { Request, Response } from 'express';

const router = express.Router();

// Get all shows
router.get('/', async (req: Request, res: Response) => {
  try {
    const shows = await Show.find();
    res.status(200).json(shows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch shows' });
  }
});

// Get all movies
router.get('/movies', async (req: Request, res: Response) => {
  try {
    const movies = await Show.find({ category: 'Movie' });
    res.status(200).json(movies);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch movies' });
  }
});

// Get all TV series
router.get('/tv-series', async (req: Request, res: Response) => {
  try {
    const tvSeries = await Show.find({ category: 'TV Series' });
    res.status(200).json(tvSeries);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch TV series' });
  }
});

// Get searched shows
router.get('/search', async (req: Request, res: Response) => {
  try {
    const searchQuery = req.query.query as string;
    const shows = await Show.find({ title: { $regex: searchQuery, $options: 'i' } });
      // TODO:search by title, description, genre 
      // $or: [
      //   { title: { $regex: searchQuery, $options: 'i' } },
      //   { description: { $regex: searchQuery, $options: 'i' } },
      //   { genre: { $regex: searchQuery, $options: 'i' } },
      // ],
    //});

    res.status(200).json(shows);
  }

  catch (error) {
    res.status(500).json({ error: 'Failed to search shows' });
  }
});

export default router;