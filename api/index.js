import express from "express";
import mongoose from "mongoose";
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js'; // this is user-defined
import authRoutes from './routes/auth.route.js';
import registerRoutes from './routes/registration.route.js'
import volunteerRoutes from './routes/volunteer.route.js'
import sessionRoutes from './routes/session.route.js'
import workshopRoutes from './routes/workshop.route.js'
import cookieParser from 'cookie-parser';
import path from 'path';


dotenv.config();

mongoose
  .connect(process.env.MONGO)
  // .connect("mongodb+srv://ncym2024:ncym2024@ncym.qpus42v.mongodb.net/ncym?retryWrites=true&w=majority&appName=ncym")
  .then(() => {
    console.log("MongoDB is connected");
  }).catch((err) => {
    console.log(err);
  });

  const __dirname = path.resolve();

const app = express();

app.use(express.json());  
app.use(cookieParser());



app.listen(3000, () => {
    console.log('Server is running on port 3000!');
  });

app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/reg', registerRoutes);
app.use('/api/workshop', workshopRoutes);
app.use('/api/volunteer', volunteerRoutes);
app.use('/api/session', sessionRoutes);

app.use(express.static(path.join(__dirname, 'client/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({
    success: false,
    statusCode,
    message
  })

});

