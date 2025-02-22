import { Show, validateShow } from '../models/Show';
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

//Get all bookmarked shows
router.get('/bookmarked', async (req: Request, res: Response) => {
  try {
    const bookmarked = await Show.find({ isBookmarked: true });
    res.status(200).json(bookmarked);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bookmarked shows' });
  }
});

// Add show to bookmarked
router.post('/bookmarked', async (req: Request, res: Response) => {
  try {
    const showId = req.body.showId;
    const show = await Show.findById(showId);

    if (!show) res.status(404).json({ error: 'Show not found' });

    Show.findByIdAndUpdate(showId, { isBookmarked: true }, { new: true });
    res.status(200).json({ message: 'Show added to bookmarked' });
  }
  
  catch (error) {
    res.status(500).json({ error: 'Failed to add show to bookmarked' });
  }
});

// Remove show from bookmarked
router.delete('/bookmarked', async (req: Request, res: Response) => {
  try {
    const showId = req.body.showId;
    const show = await Show.findById(showId);

    if (!show) res.status(404).json({ error: 'Show not found' });

    Show.findByIdAndUpdate(showId, { isBookmarked: false }, { new: true });
    res.status(200).json({ message: 'Show removed from bookmarked' });
  }
  
  catch (error) {
    res.status(500).json({ error: 'Failed to remove show from bookmarked' });
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