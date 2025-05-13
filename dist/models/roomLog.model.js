"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const roomLogModal = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    room: { type: mongoose_1.Schema.Types.ObjectId, ref: "Room", required: true },
    map: { type: mongoose_1.Schema.Types.ObjectId, ref: "Map", required: true },
    joinedAt: { type: Date, default: Date.now },
}, { versionKey: false });
exports.default = (0, mongoose_1.model)("RoomLog", roomLogModal);
