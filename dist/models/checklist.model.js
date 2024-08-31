"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const checklistModel = new mongoose_1.Schema({
    date: {
        type: String,
        required: true,
    },
    list: {
        type: Array,
        default: [],
    },
}, { timestamps: false, versionKey: false });
exports.default = (0, mongoose_1.model)("Checklist", checklistModel);
