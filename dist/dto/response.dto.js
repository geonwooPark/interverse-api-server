"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorResponse = exports.successResponse = void 0;
const successResponse = (message, data) => {
    return {
        message,
        data,
    };
};
exports.successResponse = successResponse;
const errorResponse = (message) => {
    return {
        message,
        data: null,
    };
};
exports.errorResponse = errorResponse;
