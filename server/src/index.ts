import express from 'express';
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

const app = express();

//start the server
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
})