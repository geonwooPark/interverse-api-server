import { Schema, model } from "mongoose";

export interface LikeDocument extends Document {
  parentId: string;
  likes: {
    userImage: string;
    userId: string;
    userName: string;
  }[];
  path?: string;
}

const likeModel = new Schema(
  {
    parentId: {
      type: String,
      unique: true,
      required: true,
    },
    likes: {
      type: Array,
    },
    path: {
      type: String,
    },
  },
  { timestamps: true, versionKey: false }
);

export default model<LikeDocument>("Like", likeModel);
