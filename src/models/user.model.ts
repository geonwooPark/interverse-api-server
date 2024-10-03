import { Schema, model } from "mongoose";

export interface UserDocument extends Document {
  _id: string;
  email: string;
  nickname: string;
  password: string;
  image: string;
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
      required: true,
    },
    image: {
      type: String,
    },
    role: {
      type: String,
      default: "user",
    },
  },
  { timestamps: true, versionKey: false }
);

export default model<UserDocument>("User", userModel);
