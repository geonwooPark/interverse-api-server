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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = exports.checkId = exports.checkVerificationCode = exports.sendVerificationEmail = exports.getCurrentUser = exports.loginUser = exports.createUser = void 0;
const user_model_1 = __importDefault(require("@models/user.model"));
const tempUser_model_1 = __importDefault(require("@models/tempUser.model"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jwt_1 = require("@utils/jwt");
const index_1 = require("@db/index");
const user_dto_1 = require("@dto/user.dto");
const vaildateSchemas_1 = require("@utils/vaildateSchemas");
const yup = __importStar(require("yup"));
const CustomError_1 = require("@errors/CustomError");
const response_dto_1 = require("@dto/response.dto");
const getEmailTemplete_1 = require("@utils/getEmailTemplete");
const sendEmail_1 = require("@utils/sendEmail");
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, index_1.connectDB)();
        const validatedData = yield vaildateSchemas_1.CreateUserSchema.validate(req.body);
        const { email, password, nickname } = validatedData;
        const hashedPassword = yield bcryptjs_1.default.hash(password, 12);
        const existedUser = yield user_model_1.default.findOne({ email });
        if (existedUser) {
            throw new CustomError_1.CustomError("이미 존재하는 이메일입니다.", 409);
        }
        const newUser = yield user_model_1.default.create({
            nickname,
            email,
            password: hashedPassword,
        });
        const _a = newUser.toObject(), { password: _ } = _a, safeUser = __rest(_a, ["password"]);
        return res
            .status(201)
            .json((0, response_dto_1.successResponse)("회원가입 성공!", { user: safeUser }));
    }
    catch (error) {
        if (error instanceof yup.ValidationError) {
            const validationErrors = error.errors.join(", ");
            return res.status(400).json((0, response_dto_1.errorResponse)(validationErrors));
        }
        if (error instanceof CustomError_1.CustomError) {
            return res
                .status(error.statusCode)
                .json({ message: error.message, user: null });
        }
        return res.status(500).json((0, response_dto_1.errorResponse)("서버 내부 오류"));
    }
});
exports.createUser = createUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatedData = yield vaildateSchemas_1.LoginSchema.validate(req.body);
        const { email, password } = validatedData;
        yield (0, index_1.connectDB)();
        const user = yield user_model_1.default.findOne({ email });
        if (!user) {
            throw new CustomError_1.CustomError("존재하지 않는 회원입니다.", 409);
        }
        const pwcheck = yield bcryptjs_1.default.compare(password, user.password);
        if (!pwcheck) {
            throw new CustomError_1.CustomError("잘못된 비밀번호입니다.", 409);
        }
        const payload = {
            id: user._id,
            email: user.email,
            role: user.role,
        };
        return res.status(200).json((0, response_dto_1.successResponse)("로그인에 성공했습니다.", {
            token: (0, jwt_1.getToken)(payload),
            user: (0, user_dto_1.userDto)(user),
        }));
    }
    catch (error) {
        if (error instanceof yup.ValidationError) {
            const validationErrors = error.errors.join(", ");
            return res.status(400).json((0, response_dto_1.errorResponse)(validationErrors));
        }
        if (error instanceof CustomError_1.CustomError) {
            return res.status(error.statusCode).json((0, response_dto_1.errorResponse)(error.message));
        }
        return res.status(500).json((0, response_dto_1.errorResponse)("서버 내부 오류"));
    }
});
exports.loginUser = loginUser;
const getCurrentUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.auth;
    try {
        yield (0, index_1.connectDB)();
        const userDoc = yield user_model_1.default.findOne({ email });
        if (!userDoc) {
            throw new CustomError_1.CustomError("존재하지 않는 회원입니다.", 409);
        }
        const user = (0, user_dto_1.userDto)(userDoc);
        return res.status(200).json((0, response_dto_1.successResponse)("", { user }));
    }
    catch (error) {
        if (error instanceof CustomError_1.CustomError) {
            return res.status(error.statusCode).json((0, response_dto_1.errorResponse)(error.message));
        }
        return res.status(500).json((0, response_dto_1.errorResponse)("서버 내부 오류"));
    }
});
exports.getCurrentUser = getCurrentUser;
const sendVerificationEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const verificationCode = Math.floor(100000 + Math.random() * 900000);
    const currentTime = new Date();
    try {
        yield (0, index_1.connectDB)();
        const existingTempUser = yield tempUser_model_1.default.findOne({ email });
        if (existingTempUser) {
            const timeElapsed = (currentTime.getTime() -
                new Date(existingTempUser.createdAt).getTime()) /
                1000;
            if (timeElapsed < 60) {
                throw new CustomError_1.CustomError("1분 이후 재전송 가능합니다.", 429);
            }
            else {
                yield tempUser_model_1.default.findOneAndUpdate({ email }, { verificationCode, createdAt: currentTime }, { upsert: true });
            }
        }
        const mailOptions = {
            from: "white0581@naver.com",
            to: email,
            subject: "인증 메일입니다.",
            html: (0, getEmailTemplete_1.getEmailTemplete)(verificationCode),
        };
        try {
            yield sendEmail_1.smtpTransport.sendMail(mailOptions);
        }
        catch (err) {
            console.error("이메일 전송 중 에러:", err);
            throw new CustomError_1.CustomError("이메일 전송에 실패했습니다.", 500);
        }
        yield tempUser_model_1.default.create({
            email,
            verificationCode,
            createdAt: currentTime,
        });
        sendEmail_1.smtpTransport.close();
        return res
            .status(200)
            .json((0, response_dto_1.successResponse)("이메일 전송에 성공했습니다.", true));
    }
    catch (error) {
        if (error instanceof CustomError_1.CustomError) {
            return res.status(error.statusCode).json((0, response_dto_1.errorResponse)(error.message));
        }
        return res.status(500).json((0, response_dto_1.errorResponse)("서버 내부 오류"));
    }
});
exports.sendVerificationEmail = sendVerificationEmail;
const checkVerificationCode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, code } = req.body;
    try {
        yield (0, index_1.connectDB)();
        const tempUser = yield tempUser_model_1.default.findOne({ email });
        if (tempUser && tempUser.verificationCode === code) {
            return res
                .status(200)
                .json((0, response_dto_1.successResponse)("인증에 성공했습니다.", true));
        }
        else {
            throw new CustomError_1.CustomError("인증에 실패했습니다.", 401);
        }
    }
    catch (error) {
        if (error instanceof CustomError_1.CustomError) {
            return res.status(error.statusCode).json((0, response_dto_1.errorResponse)(error.message));
        }
        return res.status(500).json((0, response_dto_1.errorResponse)("서버 내부 오류"));
    }
});
exports.checkVerificationCode = checkVerificationCode;
const checkId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        yield (0, index_1.connectDB)();
        const isExistingUser = yield user_model_1.default.findOne({ email });
        if (isExistingUser) {
            throw new CustomError_1.CustomError("가입이 불가능한 이메일입니다.", 409);
        }
        else {
            return res
                .status(200)
                .json((0, response_dto_1.successResponse)("가입 가능한 이메일입니다.", true));
        }
    }
    catch (error) {
        if (error instanceof CustomError_1.CustomError) {
            return res.status(error.statusCode).json((0, response_dto_1.errorResponse)(error.message));
        }
        return res.status(500).json((0, response_dto_1.errorResponse)("서버 내부 오류"));
    }
});
exports.checkId = checkId;
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, newPassword } = req.body;
    const hashedPassword = yield bcryptjs_1.default.hash(newPassword, 12);
    try {
        yield (0, index_1.connectDB)();
        const user = yield user_model_1.default.findOne({ email });
        if (!user) {
            throw new CustomError_1.CustomError("해당 이메일의 유저를 찾을 수 없습니다.", 404);
        }
        user.password = hashedPassword;
        yield user.save();
        return res
            .status(200)
            .json((0, response_dto_1.successResponse)("비밀번호가 성공적으로 변경되었습니다.", true));
    }
    catch (error) {
        if (error instanceof CustomError_1.CustomError) {
            return res.status(error.statusCode).json((0, response_dto_1.errorResponse)(error.message));
        }
    }
});
exports.changePassword = changePassword;
