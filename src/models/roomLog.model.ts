import { Schema, model } from "mongoose";

const roomLogModal = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    roomId: { type: Schema.Types.ObjectId, ref: "Room", required: true },
    joinedAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

export default model("RoomLog", roomLogModal);
