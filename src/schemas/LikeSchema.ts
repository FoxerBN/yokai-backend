import { Schema } from 'mongoose'
import { ILike } from '../interfaces/database/ILike'


export const LikeSchema = new Schema<ILike>({
  article: {
    type: Schema.Types.ObjectId,
    ref: 'Article',
    required: true
  },
  ipAddress: {
    type: String,
    required: true
  }
}, {
  timestamps: true
})