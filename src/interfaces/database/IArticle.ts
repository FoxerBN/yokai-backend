import { Document, Types } from 'mongoose';

export interface IArticle extends Document {
  _id: Types.ObjectId
  title: string
  slug: string
  content: string
  excerpt?: string
  author: string
  category: Types.ObjectId
  isPublished: boolean
  publishedAt?: Date
  views: number
  likes: number
  createdAt: Date
  updatedAt: Date
}
