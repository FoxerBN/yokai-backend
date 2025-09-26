import express, { Request, Response } from 'express';
import { MessageResponse } from '../interfaces/MessageResponse';
import * as updateArticleService from '../services/updateArticleService';
import { getRealIP } from '../utils/ipHelper';
import { requireAdmin } from '../middlewares/global/verifyToken';
import type { CreateArticleRequest } from '../interfaces/CreateArticleRequest';
const updateRouter = express.Router();



//**Update articles routes */

//* Create new article (protected)
updateRouter.post('/articles/create-article', requireAdmin, async (req: any, res: any) => {
  try {
    const { title, slug, content, excerpt, category }: CreateArticleRequest = req.body;

    if (!title || !slug || !content || !category) {
      return res.status(400).json({ 
        message: 'Title, slug, content, and category are required' 
      });
    }

    const newArticle = await updateArticleService.createArticle({
      title,
      slug,
      content,
      excerpt: excerpt || '',
      category
    });

    res.status(201).json(newArticle);
  } catch (error) {
    console.error('Error in create article route:', error);
    
    if (error instanceof Error) {
      if (error.message === 'Category not found') {
        return res.status(404).json({ message: 'Category not found' });
      }
      if (error.message === 'Article with this slug already exists') {
        return res.status(409).json({ message: 'Article with this slug already exists' });
      }
    }
    
    res.status(500).json({ message: 'Failed to create article' });
  }
});

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

//* Toggle like (POST)
updateRouter.post<{ slug: string }>('/articles/:slug/like', async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const ipAddress = getRealIP(req);

    const result = await updateArticleService.toggleLike(slug, ipAddress);
    
    if (!result) {
      return res.status(404).json({ message: 'Article not found' });
    }

    res.json({ 
      message: result.liked ? 'Article liked' : 'Article unliked',
      likes: result.likes,
      liked: result.liked
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to toggle like' });
  }
});

//* Check like status (GET)
updateRouter.get<{ slug: string }>('/articles/:slug/like-status', async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const ipAddress = getRealIP(req);

    const liked = await updateArticleService.hasUserLikedArticle(slug, ipAddress);
    
    res.json({ liked });
  } catch (error) {
    res.status(500).json({ message: 'Failed to check like status' });
  }
});

export default updateRouter;