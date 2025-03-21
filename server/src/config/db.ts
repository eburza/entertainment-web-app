import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

async function connectToDatabase() {
  try {
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in the environment variables');
    }

    await mongoose.connect(MONGODB_URI);
    console.log('Connected to the database');
  }
  catch (error) {
    console.error('Failed to connect to the database:', error);
    process.exit(1);
  }
}

export default connectToDatabase;