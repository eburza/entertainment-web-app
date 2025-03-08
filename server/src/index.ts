import dotenv from 'dotenv';
import path from 'path';
// Load environment variable
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import showsRouter from './routes/shows';
import bookmarkedRouter from './routes/bookmarked';
import tvRouter from './routes/tv';
import moviesRouter from './routes/movies';
import searchRouter from './routes/search';
import authRouter from './routes/auth';
import connectToDatabase from './config/db';
import errorHandler from './middleware/error';
import logging from './config/logger';
import express from 'express';
import cors from 'cors';

//connect to the database
connectToDatabase();

//logger
logging();

//create the express app
const app = express();

//cors
app.use(cors());

//middleware
app.use(express.json());

//routes
app.use('/', showsRouter);
app.use('/bookmarked', bookmarkedRouter);
app.use('/tv', tvRouter);
app.use('/movies', moviesRouter);
app.use('/search', searchRouter);
app.use('/auth', authRouter);

//error handling middleware
app.use(errorHandler);

//start the server
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});