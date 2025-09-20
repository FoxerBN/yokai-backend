import mongoose, { Schema } from 'mongoose';
import { ICategory } from '../interfaces/database/ICategory'
import { IArticle } from '../interfaces/database/IArticle'
import { ILike } from '../interfaces/database/ILike'

import { ArticleSchema } from '../schemas/ArticleSchema'
import { CategorySchema } from '../schemas/CategorySchema'
import { LikeSchema } from '../schemas/LikeSchema'

export const Category = mongoose.model<ICategory>('Category', CategorySchema)
export const Article = mongoose.model<IArticle>('Article', ArticleSchema)
export const Like = mongoose.model<ILike>('Like', LikeSchema)