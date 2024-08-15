import { Schema, model } from "mongoose";

export interface HotplaceDocument extends Document {
  category: string;
  store: string;
  address: string;
  si: string;
  gu: string;
  rating: number;
  description?: string;
  imageUrl?: string[];
  coordinate?: object;
  hashtags?: string[];
  creator?: string;
}

const hotplaceModel = new Schema(
  {
    category: {
      type: String,
      required: true,
    },
    store: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    si: {
      type: String,
      required: true,
    },
    gu: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    rating: {
      type: Number,
      required: true,
    },
    imageUrl: {
      type: Array,
    },
    coordinate: {
      type: Object,
    },
    hashtags: {
      type: Array,
    },
    creator: {
      type: String,
    },
  },
  { timestamps: true, versionKey: false }
);

export default model<HotplaceDocument>("Hotplace", hotplaceModel);
