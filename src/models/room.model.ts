import { Document, Schema, model } from "mongoose";

export interface RoomDocument extends Document {
  _id: string;
  title: string;
  host: string;
  headCount: number;
  mapSrc: string;
}

const roomModel = new Schema(
  {
    title: {
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
    mapSrc: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

export default model<RoomDocument>("Room", roomModel);
