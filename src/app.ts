import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
dotenv.config();

import { validateBody } from './middlewares/global/validateBody';
import { notFound } from './middlewares/global/notFound';
import { errorHandler } from './middlewares/global/errorHandler';
import { MessageResponse } from './interfaces/MessageResponse';

import { connectDB } from './config/db';
import mongoSanitize from 'express-mongo-sanitize';

//Routes
import articleRouter from './routes/articleRoute';
import updateRouter from './routes/updateArticleRoute';
import authRouter from './routes/authRoute';

connectDB();
mongoSanitize()
const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors(
  { origin: process.env.CLIENT_URL, credentials: true }
));
app.use(cookieParser());
// Our custom body validation middleware
app.use(express.json(), validateBody);

// Basic route
app.get<{}, MessageResponse>('/', (req, res) => {
  res.json({
    message: 'Hi there!',
  });
});

// Article routes
app.use('/api', articleRouter);
app.use('/api', updateRouter);
app.use('/api', authRouter);

// Global Middlewares
app.use(notFound);
app.use(errorHandler);

export default app;