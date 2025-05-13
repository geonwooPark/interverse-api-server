"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const tempUserModel = new mongoose_1.Schema({
    email: {
        type: String,
        required: true,
    },
    verificationCode: {
        type: Number,
        required: true,
    },
    createdAt: { type: Date, default: Date.now, expires: 200 },
}, { versionKey: false });
exports.default = (0, mongoose_1.model)("TempUser", tempUserModel);
