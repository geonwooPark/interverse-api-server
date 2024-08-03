import { Schema, model } from "mongoose";

export interface ChecklistDocument extends Document {
  date: string;
  list?: {
    id: string;
    text: string;
    status: boolean;
  }[];
}

const checklistModel = new Schema(
  {
    date: {
      type: String,
      required: true,
    },
    list: {
      type: Array,
      default: [],
    },
  },
  { timestamps: false, versionKey: false }
);

export default model<ChecklistDocument>("Checklist", checklistModel);
