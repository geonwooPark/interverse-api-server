"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const roomModel = new mongoose_1.Schema({
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
    mapId: {
        type: String,
        required: true,
    },
}, { timestamps: true, versionKey: false });
exports.default = (0, mongoose_1.model)("Room", roomModel);
