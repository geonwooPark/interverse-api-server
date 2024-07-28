import { Schema, model } from "mongoose";

export interface BookDocument extends Document {
  recommended?: boolean;
  title: string;
  description: string;
  authors: string;
  thumbnail: string;
  content: string;
  category: string;
}

const bookModel = new Schema(
  {
    recommended: {
      type: Boolean,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    authors: {
      type: Array,
      required: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

export default model<BookDocument>("Book", bookModel);
