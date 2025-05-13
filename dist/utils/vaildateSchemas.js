"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginSchema = exports.CreateUserSchema = void 0;
const yup = __importStar(require("yup"));
exports.CreateUserSchema = yup.object({
    email: yup
        .string()
        .required("이메일을 입력해주세요.")
        .email("잘못된 이메일 형식입니다."),
    password: yup
        .string()
        .required("비밀번호를 입력해주세요.")
        .matches(/^(?=.*[a-zA-Z])(?=.*[0-9]).{8,15}$/, "비밀번호는 영문을 포함하여 8~15자리이어야 합니다."),
    nickname: yup
        .string()
        .required("이름을 입력해주세요.")
        .max(10, "이름은 10자 이하로 입력해주세요."),
});
exports.LoginSchema = yup.object({
    email: yup
        .string()
        .email("유효한 이메일을 입력해주세요.")
        .required("이메일을 입력해주세요."),
    password: yup
        .string()
        .required("비밀번호를 입력해주세요.")
        .min(8, "비밀번호는 최소 8자리 이상이어야 합니다."),
});
