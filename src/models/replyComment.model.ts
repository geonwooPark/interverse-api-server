import { Schema, model } from "mongoose";

interface ReplyComment {
  commentId: string;
  replyCommentId: string;
  user: {
    userImage: string;
    userId: string;
    userName: string;
  };
  content: string;
  likeCount: number;
  createdAt: Date;
}

export interface ReplyCommentDocument extends Document {
  parentId: string;
  comments: ReplyComment[];
  path?: string;
}

const replyCommentModel = new Schema(
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

export default model<ReplyCommentDocument>("ReplyComment", replyCommentModel);
