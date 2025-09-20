import { Schema } from 'mongoose'
import { ICategory } from '../interfaces/database/ICategory'

export const CategorySchema = new Schema<ICategory>({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  description: String,
}, {
  timestamps: true
})