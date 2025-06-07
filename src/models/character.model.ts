import { Document, Schema, model } from "mongoose";

export interface CharacterDocument extends Document {
  _id: string;
  name: string;
  source: string;
  width: number;
  height: number;
}

const characterModel = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    source: {
      type: String,
      required: true,
    },
    width: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

export default model<CharacterDocument>("Character", characterModel);
