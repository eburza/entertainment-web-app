import { Schema, model } from 'mongoose';

import { IShow } from '../types/interface';

const showSchema = new Schema<IShow>({
  title: {
    type: String,
    required: true,
    trim: true,
    index: true,
    minlength: 1,
    maxlength: 255
  },
  thumbnail: {
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
  category: {
    type: String,
    required: true,
    enum: ['Movie', 'TV Series']
  },
  rating: {
    type: String,
    required: true
  },
  isTrending: {
    type: Boolean,
    default: false,
  },
  isBookmarked: {
    type: Boolean,
    default: false
  }
});

showSchema.index({ title: 'text' });

const Show = model<IShow>('Show', showSchema);

export default Show;
