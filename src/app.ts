import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import path from 'path';
import fs from 'fs';
dotenv.config();

import { validateBody } from './middlewares/global/validateBody';
import { notFound } from './middlewares/global/notFound';
import { errorHandler } from './middlewares/global/errorHandler';

import { connectDB } from './config/db';
import mongoSanitize from 'express-mongo-sanitize';

//Routes
import articleRouter from './routes/articleRoute';
import updateRouter from './routes/updateArticleRoute';
import authRouter from './routes/authRoute';

connectDB();
const app = express();

app.use(morgan('dev'));
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:", "http:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));
app.use(cors(
  { origin: process.env.CLIENT_URL, credentials: true }
));
app.use(cookieParser());
app.use(mongoSanitize());
// Our custom body validation middleware
app.use(express.json(), validateBody);

const clientDistPath = path.resolve(process.cwd(), 'dist');
const hasClientBuild = fs.existsSync(clientDistPath);

if (hasClientBuild) {
  app.use(express.static(clientDistPath));
}

// Article routes
app.use('/api', articleRouter);
app.use('/api', updateRouter);
app.use('/api', authRouter);

if (hasClientBuild) {
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }

    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// Global Middlewares
app.use(notFound);
app.use(errorHandler);

export default app;