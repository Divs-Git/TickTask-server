import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDB } from './utils/index.js';
import e from 'express';
import { errorHandler, routeNotFound } from './middlewares/errorMiddleware.js';
import routes from './routes/index.js';

dotenv.config();

connectDB();

const PORT = process.env.PORT || 5000;

const app = express();

const prodOrigin = [process.env.ORIGIN_1, process.env.ORIGIN_2];
const devOrigin = ['http://localhost:3000'];

const allowedOrigins =
  process.env.NODE_ENV === 'production' ? prodOrigin : devOrigin;

app.use(
  cors({
    origin: (origin, callback) => {
      if (allowedOrigins.includes(origin)) {
        console.log(origin, allowedOrigins);
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['POST', 'PUT', 'GET', 'PATCH', 'DELETE'],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

app.use('/api', routes);

app.use(routeNotFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
