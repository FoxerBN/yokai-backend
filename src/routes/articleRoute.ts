import express from 'express';
import { Request, Response } from 'express';
import { MessageResponse } from '../interfaces/MessageResponse';
import * as articleService from '../services/articleService';

const articleRouter = express.Router();

//**Fetch articles routes */

//* Get all articles with pagination and limit
articleRouter.get<{}, MessageResponse | any[]>('/articles', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const articles = await articleService.getAllArticles(page, limit);
    res.json(articles);
  } catch (error) {
    console.error('Error in get all articles route:', error);
    res.status(500).json({ message: 'Failed to fetch articles' });
  }
});

//* Get articles by category with pagination
articleRouter.get<{ categorySlug: string }, MessageResponse | any[]>('/articles/category/:categorySlug', async (req: Request, res: Response) => {
  try {
    const { categorySlug } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const articles = await articleService.getArticlesByCategory(categorySlug, page, limit);
    res.json(articles);
  } catch (error) {
    console.error('Error in get articles by category route:', error);
    
    // Handle specific error messages from service
    if (error instanceof Error && error.message === 'Category not found') {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    res.status(500).json({ message: 'Failed to fetch articles by category' });
  }
});

//* Get 6 articles with most likes (popular articles)
articleRouter.get<{}, MessageResponse | any[]>('/articles/popular', async (req: Request, res: Response) => {
  try {
    const articles = await articleService.getMostLikedArticles();
    res.json(articles);
  } catch (error) {
    console.error('Error in get popular articles route:', error);
    res.status(500).json({ message: 'Failed to fetch most liked articles' });
  }
});

//* Get articles by category with limit of 10 (no pagination)
articleRouter.get<{ categorySlug: string }, MessageResponse | any[]>('/articles/category/:categorySlug/limited', async (req: Request, res: Response) => {
  try {
    const { categorySlug } = req.params;
    
    const articles = await articleService.getArticlesByCategoryLimited(categorySlug);
    res.json(articles);
  } catch (error) {
    console.error('Error in get limited articles by category route:', error);
    
    // Handle specific error messages from service
    if (error instanceof Error && error.message === 'Category not found') {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    res.status(500).json({ message: 'Failed to fetch articles by category' });
  }
});

//* Quick search for dropdown/autocomplete (returns only id, title, slug)
articleRouter.get<{}, MessageResponse | any[]>('/articles/search/quick', async (req: Request, res: Response) => {
  try {
    const searchTerm = req.query.q as string;
    
    if (!searchTerm) {
      return res.status(400).json({ message: 'Search term is required' });
    }

    const limit = parseInt(req.query.limit as string) || 8;
    const articles = await articleService.quickSearchArticles(searchTerm, limit);
    
    res.json(articles);
  } catch (error) {
    console.error('Error in quick search route:', error);
    res.status(500).json({ message: 'Quick search failed' });
  }
});

//* Get single article by slug
articleRouter.get<{ slug: string }, MessageResponse | any>('/articles/:slug', async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const article = await articleService.getArticleBySlug(slug);
    
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    res.json(article);
  } catch (error) {
    console.error('Error in get article by slug route:', error);
    res.status(500).json({ message: 'Failed to fetch article' });
  }
});

//* Get article count for pagination (total count or by category)
articleRouter.get<{}, MessageResponse | { count: number }>('/count/articles/count', async (req: Request, res: Response) => {
  try {
    const categorySlug = req.query.category as string;
    
    const count = await articleService.getArticleCount(categorySlug);
    res.json({ count });
  } catch (error) {
    console.error('Error in get article count route:', error);
    res.status(500).json({ message: 'Failed to get article count' });
  }
});



export default articleRouter;