import { Schema, model } from "mongoose";

export interface RoomDocument extends Document {
  _id: string;
  title: string;
  password: string;
  host: string;
  headCount: number;
}

const roomModel = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    host: {
      type: String,
      required: true,
    },
    headCount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

export default model<RoomDocument>("Room", roomModel);
