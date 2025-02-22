import { Show, validateShow } from '../models/Show';
import express, { Request, Response } from 'express';

const router = express.Router();

//Get all bookmarked shows
router.get('/', async (req: Request, res: Response) => {
  try {
    const bookmarked = await Show.find({ isBookmarked: true });
    res.status(200).json(bookmarked);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bookmarked shows' });
  }
});

// Add show to bookmarked
router.post('/', async (req: Request, res: Response) => {
  try {
    const { error } = validateShow(req.body); 
    if (error) res.status(400).send(error);

    const showId = req.body.showId;
    if (!showId) res.status(400).json({ error: 'Show ID is required' });

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
router.delete('/', async (req: Request, res: Response) => {
  try {
    const { error } = validateShow(req.body); 
    if (error) res.status(400).send(error);

    const showId = req.body.showId;
    if (!showId) res.status(400).json({ error: 'Show ID is required' });

    const show = await Show.findById(showId);
    if (!show) res.status(404).json({ error: 'Show not found' });

    Show.findByIdAndUpdate(showId, { isBookmarked: false }, { new: true });
    res.status(200).json({ message: 'Show removed from bookmarked' });
  }
  
  catch (error) {
    res.status(500).json({ error: 'Failed to remove show from bookmarked' });
  }
});

export default router;