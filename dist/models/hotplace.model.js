"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const hotplaceModel = new mongoose_1.Schema({
    category: {
        type: String,
        required: true,
    },
    store: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    si: {
        type: String,
        required: true,
    },
    gu: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    rating: {
        type: Number,
        required: true,
    },
    imageUrl: {
        type: Array,
    },
    coordinate: {
        type: Object,
    },
    hashtags: {
        type: Array,
    },
    creator: {
        type: String,
    },
}, { timestamps: true, versionKey: false });
exports.default = (0, mongoose_1.model)("Hotplace", hotplaceModel);
