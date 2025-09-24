import express, { Request, Response } from 'express';
import { MessageResponse } from '../interfaces/MessageResponse';
import * as updateArticleService from '../services/updateArticleService';

const updateRouter = express.Router();



//**Update articles routes */

//* Increment article views (POST request)
updateRouter.post<{ slug: string }, MessageResponse>('/articles/:slug/view', async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    await updateArticleService.incrementArticleViews(slug);
    res.json({ message: 'Views updated successfully' });
  } catch (error) {
    console.error('Error in increment views route:', error);
    res.status(500).json({ message: 'Failed to update article views' });
  }
});

//* Like article (POST request)
updateRouter.post<{ slug: string }, MessageResponse | { message: string; likes: number }>('/articles/:slug/like', async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const result = await updateArticleService.likeArticle(slug);
    
    if (!result) {
      return res.status(404).json({ message: 'Article not found' });
    }

    res.json({ 
      message: 'Article liked successfully', 
      likes: result.likes 
    });
  } catch (error) {
    console.error('Error in like article route:', error);
    res.status(500).json({ message: 'Failed to like article' });
  }
});

export default updateRouter;