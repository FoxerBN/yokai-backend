import { Schema } from 'mongoose'
import { IArticle } from '../interfaces/database/IArticle'

export const ArticleSchema = new Schema<IArticle>({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  content: {
    type: String,
    required: true
  },
  excerpt: String,
  author: {
    type: String,
    required: true,
    default: 'Admin'
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  publishedAt: Date,
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  imageUrl: {              // PRIDAJ
    type: String,
    default: ''
  },
  sources: {               // PRIDAJ
    type: [String],
    default: []
  },
  readingTime: {           // PRIDAJ
    type: Number,
    default: 0
  }
}, {
  timestamps: true
})