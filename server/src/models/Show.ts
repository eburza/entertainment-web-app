import { Schema, model, Types } from 'mongoose';
import Joi from 'joi';
import { IShow } from '../types/interface';

const showSchema = new Schema<IShow>({
  id: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
    index: true,
    minlength: 1,
    maxlength: 255
  },
  name: {
    type: String,
    required: true,
    trim: true,
    index: true,
    minlength: 1,
    maxlength: 255
  },
  backdrop_path: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 255
  },
  year: {
    type: Number,
    required: true,
    min: 1900,
    max: new Date().getFullYear()
  },
  media_type: {
    type: String,
    required: true,
    enum: ['movie', 'tv']
  },
  vote_average: {
    type: Number,
    required: true
  },
  isTrending: {
    type: Boolean,
    default: false,
  },
  isBookmarked: {
    type: Boolean,
    default: false
  },
  isWatched: {
    type: Boolean,
    default: false
  },
  isFavorite: {
    type: Boolean,
    default: false
  }
});

showSchema.index({ title: 'text' });

const Show = model<IShow>('Show', showSchema);

const showValidationSchema = Joi.object({
  title: Joi.string().required().min(1).max(255),
  thumbnail: Joi.string().required().min(1).max(255),
  year: Joi.number().required().min(1900).max(new Date().getFullYear()),
  category: Joi.string().required().valid('Movie', 'TV Series'),
  rating: Joi.string().required(),
  isTrending: Joi.boolean().default(false),
  isBookmarked: Joi.boolean().default(false)
});

const validateShow = (show: IShow) => {
  const { error } = showValidationSchema.validate(show);
  if (error) return { error: error.details[0].message };
  
  if (!show.id || !Types.ObjectId.isValid(show.id)) {
    return { error: 'Invalid show ID' };
  }

  if (!show.title || !show.backdrop_path || !show.year || !show.media_type || !show.vote_average) {
    return { error: 'Missing required fields' };
  }

  return { error: null };
}

export { Show, validateShow };