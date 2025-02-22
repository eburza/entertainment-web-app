import { Schema, model } from 'mongoose';
import Show from './Show';
import { IUser } from '../types/interface';

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    index: true,
    required: true,
    minlength: 3,
    maxlength: 50
  },
  email: {
    type: String,
    require: true,
    minlength: 5,
    maxlength: 50,
    unique: true,
    match: [
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'Please use a valid email address'
    ]
  },
  password: {
    type: String,
    require: true,
    minlength: 8,
    maxlength: 255
  },
  isBookmarked: {
    type: [Show],
    ref: 'Show'
  }
});

userSchema.index({ name: 'text' });
const User = model<IUser>('User', userSchema);

export default User;