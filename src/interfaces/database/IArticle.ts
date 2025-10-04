import { Document, Types } from 'mongoose';

export interface IArticle extends Document {
  _id: Types.ObjectId
  title: string
  slug: string
  content: string
  excerpt?: string
  author: string
  category: Types.ObjectId
  publishedAt?: Date
  views: number
  likes: number
  imageUrl?: string        // PRIDAJ
  sources?: string[]       // PRIDAJ
  readingTime?: number     // PRIDAJ
  createdAt: Date
  updatedAt: Date
}