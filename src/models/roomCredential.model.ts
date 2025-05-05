import { Document, Schema, model } from "mongoose";

export interface RoomCredential extends Document {
  _id: string;
  roomId: string;
  password: string;
}

const RoomCredentialSchema = new Schema({
  roomId: { type: String, ref: "Room", unique: true },
  password: {
    type: String,
    required: true,
  },
});

export default model<RoomCredential>("RoomCredential", RoomCredentialSchema);
