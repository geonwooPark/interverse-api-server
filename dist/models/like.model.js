"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const likeModel = new mongoose_1.Schema({
    parent: {
        type: Object,
        required: true,
    },
    likes: {
        type: Array,
    },
    path: {
        type: String,
    },
}, { timestamps: true, versionKey: false });
exports.default = (0, mongoose_1.model)("Like", likeModel);
