"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const replyCommentModel = new mongoose_1.Schema({
    parentId: {
        type: String,
        unique: true,
        required: true,
    },
    comments: {
        type: Array,
    },
    path: {
        type: String,
    },
}, { timestamps: true, versionKey: false });
exports.default = (0, mongoose_1.model)("ReplyComment", replyCommentModel);
