
import express from 'express';
import dotenv from 'dotenv';
import connectDB from './database/db.js';
import productRoute from './routes/product.js';
import path from "path";
dotenv.config();
const app = express();
const port = process.env.PORT;

// middleware
app.use(express.json());


//import routes
import userRoute from './routes/userRoute.js';

//using routes
app.use("/api", userRoute);
app.use ("/api",productRoute);

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({ message: "Invalid JSON format in request body" });
  }
  next(err);
});
//static file
app.use(express.json());
app.use("/uploads", express.static(path.resolve("uploads")));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  connectDB();
});
