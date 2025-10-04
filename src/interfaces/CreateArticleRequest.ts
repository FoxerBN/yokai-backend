export interface CreateArticleRequest {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: string;
  imageUrl?: string;
  sources?: string[];
  readingTime?: number;
}