import { Article,Like,Category } from '../models/DatabaseModels';
import { IArticle } from '../interfaces/database/IArticle';
import type { CreateArticleRequest } from '../interfaces/CreateArticleRequest';



/**
 * Create new article
 */
export async function createArticle(articleData: CreateArticleRequest): Promise<IArticle> {
  try {
    // Find category by slug
    const category = await Category.findOne({ slug: articleData.category });
    if (!category) {
      throw new Error('Category not found');
    }

    // Check if slug already exists
    const existingArticle = await Article.findOne({ slug: articleData.slug });
    if (existingArticle) {
      throw new Error('Article with this slug already exists');
    }

    // Calculate reading time if not provided
    const readingTime = articleData.readingTime || calculateReadingTime(articleData.content);

    const newArticle = new Article({
      title: articleData.title,
      slug: articleData.slug,
      content: articleData.content,
      excerpt: articleData.excerpt,
      author: 'foxerBN',
      category: category._id,
      imageUrl: articleData.imageUrl || '',
      sources: articleData.sources || [],
      readingTime: readingTime, 
      isPublished: true,
      publishedAt: new Date(),
      views: 0,
      likes: 0
    });

    await newArticle.save();
    
    // Return with populated category
    const populatedArticle = await Article.findById(newArticle._id)
      .populate('category', 'name slug description')
      .lean();

    return populatedArticle as IArticle;
  } catch (error) {
    console.error('Error creating article:', error);
    throw error;
  }
}


export async function updateArticle(slug: string, updateData: Partial<CreateArticleRequest>): Promise<IArticle | null> {
  try {
    const article = await Article.findOne({ slug });
    if (!article) {
      throw new Error('Article not found');
    }

    if (updateData.content && !updateData.readingTime) {
      updateData.readingTime = calculateReadingTime(updateData.content);
    }

    const updatedArticle = await Article.findOneAndUpdate(
      { slug },
      { $set: updateData },
      { new: true }
    ).populate('category', 'name slug description').lean();

    return updatedArticle as IArticle | null;
  } catch (error) {
    console.error('Error updating article:', error);
    throw error;
  }
}

export async function deleteArticle(slug: string): Promise<boolean> {
  try {
    const article = await Article.findOne({ slug });
    if (!article) {
      throw new Error('Article not found');
    }

    await Article.deleteOne({ _id: article._id });
    await Like.deleteMany({ article: article._id });
    
    return true;
  } catch (error) {
    console.error('Error deleting article:', error);
    throw error;
  }
}

// Helper funkcia na výpočet reading time (ak ho chceš počítať na backende)
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}


/**
 * Toggle like - add if not liked, remove if already liked
 */
export async function toggleLike(slug: string, ipAddress: string): Promise<{ likes: number; liked: boolean } | null> {
  try {
    const article = await Article.findOne({ slug });
    if (!article) return null;

    const existingLike = await Like.findOne({ 
      article: article._id, 
      ipAddress 
    });

    if (existingLike) {
      // Remove like
      await Like.deleteOne({ _id: existingLike._id });
      const updatedArticle = await Article.findByIdAndUpdate(
        article._id,
        { $inc: { likes: -1 } },
        { new: true }
      );
      return { likes: updatedArticle!.likes, liked: false };
    } else {
      // Add like
      await new Like({ article: article._id, ipAddress }).save();
      const updatedArticle = await Article.findByIdAndUpdate(
        article._id,
        { $inc: { likes: 1 } },
        { new: true }
      );
      return { likes: updatedArticle!.likes, liked: true };
    }
  } catch (error) {
    console.error('Error toggling like:', error);
    throw new Error('Failed to toggle like');
  }
}

/**
 * Check if user liked article
 */
export async function hasUserLikedArticle(slug: string, ipAddress: string): Promise<boolean> {
  try {
    const article = await Article.findOne({ slug });
    if (!article) return false;

    const like = await Like.findOne({ 
      article: article._id, 
      ipAddress 
    });
    
    return !!like;
  } catch (error) {
    console.error('Error checking like status:', error);
    return false;
  }
}

/**
 * Increment article views
 */
export async function incrementArticleViews(slug: string): Promise<void> {
  try {
    await Article.findOneAndUpdate(
      { slug },
      { $inc: { views: 1 } }
    );
  } catch (error) {
    console.error('Error incrementing article views:', error);
    throw new Error('Failed to update article views');
  }
}