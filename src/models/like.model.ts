import { Schema, model } from "mongoose";

export interface LikeDocument extends Document {
  parent: {
    title: string;
    parentId: string;
    path: string;
  };
  likes: {
    userImage: string;
    userId: string;
    userName: string;
  }[];
  path?: string;
}

const likeModel = new Schema(
  {
    parent: {
      type: Object,
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
