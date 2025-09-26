export interface CreateArticleRequest {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: string; // category slug or ObjectId
}