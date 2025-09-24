import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';
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

connectDB();
mongoSanitize()
const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());

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

// Global Middlewares
app.use(notFound);
app.use(errorHandler);

export default app;
