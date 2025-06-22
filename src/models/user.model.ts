import { Document, Schema, model } from "mongoose";

export interface UserDocument extends Document {
  _id: string;
  email: string;
  nickname: string;
  password: string;
  role: "user" | "admin";
}

const userModel = new Schema(
  {
    nickname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
    },
    role: {
      type: String,
      default: "user",
    },
    isOAuthUser: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, versionKey: false }
);

export default model<UserDocument>("User", userModel);
