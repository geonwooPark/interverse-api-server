import { Schema, model } from "mongoose";

interface Comment {
  commentId: string;
  user: {
    userImage: string;
    userId: string;
    userName: string;
  };
  parent: {
    title: string;
    parentId: string;
    path: string;
  };
  content: string;
  likeCount: number;
  isDeleted: boolean;
  createdAt: Date;
}

export interface CommentDocument extends Document {
  parentId: string;
  comments: Comment[];
  path?: string;
}

const commentModel = new Schema(
  {
    parentId: {
      type: String,
      unique: true,
      required: true,
    },
    comments: {
      type: Array,
    },
    path: {
      type: String,
    },
  },
  { timestamps: true, versionKey: false }
);

export default model<CommentDocument>("Comment", commentModel);
