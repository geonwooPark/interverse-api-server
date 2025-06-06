import { Document, Schema, model } from "mongoose";

export interface MapDocument extends Document {
  _id: string;
  name: string;
  thumbnail: string;
  mapSrc: string;
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
    mapSrc: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

export default model<MapDocument>("Map", mapModel);
