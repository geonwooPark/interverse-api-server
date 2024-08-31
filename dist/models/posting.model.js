"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const postingModel = new mongoose_1.Schema({
    category: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    thumbnailURL: {
        type: String,
    },
    content: {
        type: String,
    },
    viewCount: {
        type: Number,
        default: 0,
    },
    likeCount: {
        type: Number,
        default: 0,
    },
    commentCount: {
        type: Number,
        default: 0,
    },
}, { timestamps: true, versionKey: false });
exports.default = (0, mongoose_1.model)("Posting", postingModel);
