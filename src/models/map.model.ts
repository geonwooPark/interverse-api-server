import { Document, Schema, model } from "mongoose";

export interface MapDocument extends Document {
  _id: string;
  name: string;
  thumbnail: string;
  source: string;
}

const mapModel = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    source: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

export default model<MapDocument>("Map", mapModel);
