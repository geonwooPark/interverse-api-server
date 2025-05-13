"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userDto = void 0;
const userDto = (user) => {
    return {
        id: user._id,
        nickname: user.nickname,
        email: user.email,
        role: user.role,
    };
};
exports.userDto = userDto;
