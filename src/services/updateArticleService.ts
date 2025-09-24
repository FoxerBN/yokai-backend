import { Article } from '../models/DatabaseModels';

/**
 * Like article by slug
 */
export async function likeArticle(slug: string): Promise<{ likes: number } | null> {
  try {
    const article = await Article.findOneAndUpdate(
      { slug },
      { $inc: { likes: 1 } },
      { new: true }
    );
    
    if (!article) {
      return null;
    }
    
    return { likes: article.likes };
  } catch (error) {
    console.error('Error liking article:', error);
    throw new Error('Failed to like article');
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