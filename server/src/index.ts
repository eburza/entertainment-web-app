import showsRouter from './routes/shows';
import bookmarkedRouter from './routes/bookmarked';
import express from 'express';
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

//create the express app
const app = express();

//middleware
app.use(express.json());

//routes
app.use('/shows', showsRouter);
app.use('/bookmarked', bookmarkedRouter);

//start the server
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});