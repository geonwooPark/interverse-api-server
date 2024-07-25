import { Schema, model } from "mongoose";

export interface PostingDocument extends Document {
  category: string;
  title: string;
  description?: string;
  thumbnailURL?: string;
  content?: string;
  views?: number;
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
    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true, versionKey: false }
);

export default model<PostingDocument>("Posting", postingModel);
