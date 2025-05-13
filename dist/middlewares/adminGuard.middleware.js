"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminGuardMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const CustomError_1 = require("@errors/CustomError");
const response_dto_1 = require("@dto/response.dto");
const adminGuardMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.headers.authorization;
        const secretKey = process.env.SECRET_KEY;
        req.auth = jsonwebtoken_1.default.verify(token, secretKey);
        if (req.auth.role !== "admin") {
            throw new CustomError_1.CustomError("접근 권한이 없습니다.", 409);
        }
        return next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            return res.status(419).json((0, response_dto_1.errorResponse)("토큰이 만료되었습니다."));
        }
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            return res.status(401).json((0, response_dto_1.errorResponse)("유효하지 않은 토큰입니다."));
        }
        if (error instanceof CustomError_1.CustomError) {
            return res.status(error.statusCode).json((0, response_dto_1.errorResponse)(error.message));
        }
        return res.status(500).json((0, response_dto_1.errorResponse)("서버 내부 오류"));
    }
});
exports.adminGuardMiddleware = adminGuardMiddleware;
