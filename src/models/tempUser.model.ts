import { Schema, model } from "mongoose";

export interface TempUserDocument extends Document {
  _id: string;
  email: string;
  verificationCode: string;
  createdAt: Date;
}

const tempUserModel = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    verificationCode: {
      type: Number,
      required: true,
    },
    createdAt: { type: Date, default: Date.now, expires: 200 },
  },
  { versionKey: false }
);

export default model<TempUserDocument>("TempUser", tempUserModel);
