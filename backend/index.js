
import express from 'express';
import dotenv from 'dotenv';
import connectDB from './database/db.js';
dotenv.config();
const app = express();
const port = process.env.PORT;

// middleware
app.use(express.json());


//import routes
import userRoute from './routes/userRoute.js';

//using routes
app.use("/api", userRoute);


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  connectDB();
});
