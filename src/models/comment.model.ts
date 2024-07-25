import { Schema, model } from "mongoose";

interface Comment {
  commentId: string;
  user: {
    userImage: string;
    userId: string;
    userName: string;
  };
  content: string;
  like: number;
  isDeleted: boolean;
}

export interface CommentDocument extends Document {
  parrentId: string;
  comments: Comment[];
  path: string;
}

const commentModel = new Schema(
  {
    parrentId: {
      type: String,
      unique: true,
      required: true,
    },
    comments: {
      type: Array,
    },
    path: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

export default model<CommentDocument>("Comment", commentModel);
