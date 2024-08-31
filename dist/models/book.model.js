"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const bookModel = new mongoose_1.Schema({
    recommended: {
        type: Boolean,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    authors: {
        type: Array,
        required: true,
    },
    thumbnail: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
}, { timestamps: true, versionKey: false });
exports.default = (0, mongoose_1.model)("Book", bookModel);
