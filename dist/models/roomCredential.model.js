"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const RoomCredentialSchema = new mongoose_1.Schema({
    roomId: { type: String, ref: "Room", unique: true },
    password: {
        type: String,
        required: true,
    },
});
exports.default = (0, mongoose_1.model)("RoomCredential", RoomCredentialSchema);
