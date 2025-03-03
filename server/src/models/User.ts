import { Schema, model } from 'mongoose';
import { IUser } from '../types/interface';

const userSchema = new Schema<IUser>({
  id: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true,
  },
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
    maxlength: 255,
    match: [
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ]
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  isGuest: {
    type: Boolean,
    default: false
  },
  isUser: {
    type: Boolean,
    default: true
  },
  isAuthenticated: {
    type: Boolean,
    default: false
  }
});

userSchema.index({ name: 'text' });
const User = model<IUser>('User', userSchema);

export default User;