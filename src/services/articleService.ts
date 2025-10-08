import { Article, Category } from '../models/DatabaseModels';
import { IArticle } from '../interfaces/database/IArticle';
import { Types } from 'mongoose';

/**
 * Fetch all articles with optional pagination
 */
export async function getAllArticles(page = 1, limit = 10): Promise<IArticle[]> {
  try {
    const skip = (page - 1) * limit;
    
    const articles = await Article.find({ publishedAt: { $exists: true } })
      .populate('category', 'name slug description')
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    
    return articles;
  } catch (error) {
    console.error('Error fetching all articles:', error);
    throw new Error('Failed to fetch articles');
  }
}

/**
 * Fetch articles by category
 */
export async function getArticlesByCategory(categorySlug: string, page = 1, limit = 10): Promise<IArticle[]> {
  try {
    const skip = (page - 1) * limit;
  
    const category = await Category.findOne({ slug: categorySlug });
    
    if (!category) {
      console.log('❌ Category not found with slug:', categorySlug);
      throw new Error('Category not found');
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
    
    console.log(`✅ Returning ${articles.length} articles (page ${page}, limit ${limit})`);
    
    return articles;
  } catch (error) {
    console.error('❌ Error fetching articles by category:', error);
    throw error;
  }
}

/**
 * Fetch 6 articles with most likes
 */
export async function getMostLikedArticles(): Promise<IArticle[]> {
  try {
    const articles = await Article.find({ publishedAt: { $exists: true } })
      .populate('category', 'name slug description')
      .sort({ likes: -1, publishedAt: -1 })
      .limit(6)
      .lean();
    
    return articles;
  } catch (error) {
    console.error('Error fetching most liked articles:', error);
    throw new Error('Failed to fetch most liked articles');
  }
}

/**
 * Fetch articles by category with limit of 10
 */
export async function getArticlesByCategoryLimited(categorySlug: string): Promise<IArticle[]> {
  try {
    // Find category first
    const category = await Category.findOne({ slug: categorySlug });
    if (!category) {
      throw new Error('Category not found');
    }
    
    const articles = await Article.find({ 
      category: category._id,
      publishedAt: { $exists: true }
    })
      .populate('category', 'name slug description')
      .sort({ publishedAt: -1 })
      .limit(10)
      .lean();
    
    return articles;
  } catch (error) {
    console.error('Error fetching limited articles by category:', error);
    throw error;
  }
}

/**
 * Get single article by slug
 */
export async function getArticleBySlug(slug: string): Promise<IArticle | null> {
  try {
    const article = await Article.findOne({ slug, publishedAt: { $exists: true } })
      .populate('category', 'name slug description')
      .lean();
    
    return article;
  } catch (error) {
    console.error('Error fetching article by slug:', error);
    throw new Error('Failed to fetch article');
  }
}


/**
 * Get article count for pagination
 */
export async function getArticleCount(categorySlug?: string): Promise<number> {
  try {
    let query: any = { publishedAt: { $exists: true } };
    
    if (categorySlug) {
      const category = await Category.findOne({ slug: categorySlug });
      if (!category) {
        return 0;
      }
      query = { ...query, category: category._id };
    }
    
    const count = await Article.countDocuments(query);
    return count;
  } catch (error) {
    console.error('Error getting article count:', error);
    throw new Error('Failed to get article count');
  }
}


/**
 * Quick search for dropdown/autocomplete (returns only id, title, slug)
 */
export async function quickSearchArticles(searchTerm: string, limit = 8): Promise<Partial<IArticle>[]> {
  try {
    const articles = await Article.find({
      publishedAt: { $exists: true },
      $or: [
        { title: { $regex: searchTerm, $options: 'i' } },
        { excerpt: { $regex: searchTerm, $options: 'i' } },
        { content: { $regex: searchTerm, $options: 'i' } }
      ]
    })
      .select('_id title slug')
      .limit(limit)
      .lean();
    
    return articles;
  } catch (error) {
    console.error('Error in quick search:', error);
    throw new Error('Quick search failed');
  }
}