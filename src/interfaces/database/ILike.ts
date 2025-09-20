import { Document, Types } from 'mongoose';

export interface ILike extends Document {
  _id: Types.ObjectId
  article: Types.ObjectId
  ipAddress: string
  createdAt: Date
}