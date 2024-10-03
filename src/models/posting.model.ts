import { Schema, model } from "mongoose";

export interface PostingDocument extends Document {
  _id: string;
  category: string;
  title: string;
  description?: string;
  thumbnailURL?: string;
  content?: string;
  viewCount?: number;
  likeCount?: number;
  commentCount?: number;
}

const postingModel = new Schema(
  {
    category: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    thumbnailURL: {
      type: String,
    },
    content: {
      type: String,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    likeCount: {
      type: Number,
      default: 0,
    },
    commentCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true, versionKey: false }
);

export default model<PostingDocument>("Posting", postingModel);
