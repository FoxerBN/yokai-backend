import express from 'express';
import { Article, Category } from '../models/DatabaseModels';
import { Request, Response } from 'express';
import { MessageResponse } from '../interfaces/MessageResponse';

const articleRouter = express.Router();

//**Fetch articles routes */

//* Get all articles with pagination and limit
articleRouter.get<{}, MessageResponse | any[]>('/articles', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const articles = await Article.find({ publishedAt: { $exists: true } })
      .populate('category', 'name slug description')
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    res.json(articles);
  } catch (error) {
    console.error('Error fetching all articles:', error);
    res.status(500).json({ message: 'Failed to fetch articles' });
  }
});

//* Get articles by category with pagination
articleRouter.get<{ categorySlug: string }, MessageResponse | any[]>('/articles/category/:categorySlug', async (req: Request, res: Response) => {
  try {
    const { categorySlug } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Find category first
    const category = await Category.findOne({ slug: categorySlug });
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const articles = await Article.find({ 
      category: category._id,
      publishedAt: { $exists: true }
    })
      .populate('category', 'name slug description')
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    res.json(articles);
  } catch (error) {
    console.error('Error fetching articles by category:', error);
    res.status(500).json({ message: 'Failed to fetch articles by category' });
  }
});

//* Get 6 articles with most likes (popular articles)
articleRouter.get<{}, MessageResponse | any[]>('/articles/popular', async (req: Request, res: Response) => {
  try {
    const articles = await Article.find({ publishedAt: { $exists: true } })
      .populate('category', 'name slug description')
      .sort({ likes: -1, publishedAt: -1 })
      .limit(6)
      .lean();

    res.json(articles);
  } catch (error) {
    console.error('Error fetching most liked articles:', error);
    res.status(500).json({ message: 'Failed to fetch most liked articles' });
  }
});

//* Get articles by category with limit of 10 (no pagination)
articleRouter.get<{ categorySlug: string }, MessageResponse | any[]>('/articles/category/:categorySlug/limited', async (req: Request, res: Response) => {
  try {
    const { categorySlug } = req.params;

    // Find category first
    const category = await Category.findOne({ slug: categorySlug });
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const articles = await Article.find({ 
      category: category._id,
      publishedAt: { $exists: true }
    })
      .populate('category', 'name slug description')
      .sort({ publishedAt: -1 })
      .limit(10)
      .lean();

    res.json(articles);
  } catch (error) {
    console.error('Error fetching limited articles by category:', error);
    res.status(500).json({ message: 'Failed to fetch articles by category' });
  }
});

//* Search articles by title, content or excerpt
articleRouter.get<{}, MessageResponse | any[]>('/articles/search', async (req: Request, res: Response) => {
  try {
    const searchTerm = req.query.q as string;
    
    if (!searchTerm) {
      return res.status(400).json({ message: 'Search term is required' });
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const articles = await Article.find({
      publishedAt: { $exists: true },
      $or: [
        { title: { $regex: searchTerm, $options: 'i' } },
        { content: { $regex: searchTerm, $options: 'i' } },
        { excerpt: { $regex: searchTerm, $options: 'i' } }
      ]
    })
      .populate('category', 'name slug description')
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    res.json(articles);
  } catch (error) {
    console.error('Error searching articles:', error);
    res.status(500).json({ message: 'Failed to search articles' });
  }
});

//* Get single article by slug
articleRouter.get<{ slug: string }, MessageResponse | any>('/articles/:slug', async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const article = await Article.findOne({ 
      slug, 
      publishedAt: { $exists: true } 
    })
      .populate('category', 'name slug description')
      .lean();

    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    res.json(article);
  } catch (error) {
    console.error('Error fetching article by slug:', error);
    res.status(500).json({ message: 'Failed to fetch article' });
  }
});

//* Get article count for pagination (total count or by category)
articleRouter.get<{}, MessageResponse | { count: number }>('/count/articles/count', async (req: Request, res: Response) => {
  try {
    const categorySlug = req.query.category as string;
    let query: any = { publishedAt: { $exists: true } };

    // If category slug is provided, filter by category
    if (categorySlug) {
      const category = await Category.findOne({ slug: categorySlug });
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
      query.category = category._id;
    }

    const count = await Article.countDocuments(query);
    res.json({ count });
  } catch (error) {
    console.error('Error getting article count:', error);
    res.status(500).json({ message: 'Failed to get article count' });
  }
});

//**Update articles routes */

//* Increment article views (POST request)
articleRouter.post<{ slug: string }, MessageResponse>('/articles/:slug/view', async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const article = await Article.findOneAndUpdate(
      { slug },
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    res.json({ message: 'Views updated successfully' });
  } catch (error) {
    console.error('Error incrementing article views:', error);
    res.status(500).json({ message: 'Failed to update article views' });
  }
});

//* Like/Unlike article (POST request)
articleRouter.post<{ slug: string }, MessageResponse>('/articles/:slug/like', async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const article = await Article.findOneAndUpdate(
      { slug },
      { $inc: { likes: 1 } },
      { new: true }
    );

    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    res.json({ message: 'Article liked successfully', likes: article.likes });
  } catch (error) {
    console.error('Error liking article:', error);
    res.status(500).json({ message: 'Failed to like article' });
  }
});

export default articleRouter;