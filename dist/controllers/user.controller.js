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
exports.getLikedPost = exports.getMyComments = exports.getAuth = exports.createUser = void 0;
const comment_model_1 = __importDefault(require("../models/comment.model"));
const like_model_1 = __importDefault(require("../models/like.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const replyComment_model_1 = __importDefault(require("../models/replyComment.model"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jwt_1 = require("../utils/jwt");
const db_1 = require("../db");
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, name } = req.body;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,15}$/;
    const hashedPassword = yield bcryptjs_1.default.hash(password, 12);
    if (name.trim() === "" || email.trim() === "" || password.trim() === "") {
        return res.status(409).json({ message: "빈칸을 모두 입력해주세요." });
    }
    if (!emailRegex.test(email)) {
        return res.status(409).json({ message: "잘못된 이메일 형식입니다." });
    }
    if (name.length > 10) {
        return res
            .status(409)
            .json({ message: "이름은 10자 이하로 입력해주세요." });
    }
    if (parseInt(password.length, 10) < 8 || !passwordRegex.test(password)) {
        return res
            .status(409)
            .json({ message: "비밀번호는 영문을 포함하여 8~15자리이어야 합니다." });
    }
    try {
        yield (0, db_1.connectDB)();
        const existedUser = yield user_model_1.default.findOne({ email });
        if (existedUser) {
            return res.status(409).json({ message: "이미 존재하는 이메일입니다." });
        }
        yield user_model_1.default.create({ name, email, password: hashedPassword, image: "" });
        return res.status(201).json({ message: "회원가입 성공!" });
    }
    catch (error) {
        return res.status(500).json({ error: "서버 내부 오류" });
    }
});
exports.createUser = createUser;
const getAuth = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (email.trim() === "" || password.trim() === "") {
        return res.status(409).json({ message: "빈칸을 모두 입력해주세요." });
    }
    try {
        yield (0, db_1.connectDB)();
        const user = yield user_model_1.default.findOne({ email });
        if (!user) {
            return res.status(409).json({ message: "존재하지 않는 회원입니다." });
        }
        const pwcheck = yield bcryptjs_1.default.compare(password, user.password);
        if (!pwcheck) {
            return res.status(409).json({ message: "잘못된 비밀번호입니다." });
        }
        const payload = {
            email: user.email,
            name: user.name,
            image: user.image,
            role: user.role,
        };
        return res.status(200).send({ token: (0, jwt_1.getToken)(payload) });
    }
    catch (error) {
        return res.status(500).json({ error: "서버 내부 오류" });
    }
});
exports.getAuth = getAuth;
const getMyComments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        yield (0, db_1.connectDB)();
        const [myComments, myReplyComments] = yield Promise.all([
            comment_model_1.default.find({
                comments: {
                    $elemMatch: {
                        "user.userId": userId,
                    },
                },
            }),
            replyComment_model_1.default.find({
                comments: {
                    $elemMatch: {
                        "user.userId": userId,
                    },
                },
            }),
        ]);
        const comments = [];
        for (const comment of myComments) {
            comments.push(...comment.comments);
        }
        for (const comment of myReplyComments) {
            comments.push(...comment.comments);
        }
        const result = comments
            .filter((comment) => comment.user.userId === userId)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        return res.status(200).json({ comments: result });
    }
    catch (error) {
        return res.status(500).json({ error: "서버 내부 오류" });
    }
});
exports.getMyComments = getMyComments;
const getLikedPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        yield (0, db_1.connectDB)();
        const likedPost = yield like_model_1.default.find({
            likes: {
                $elemMatch: {
                    userId,
                },
            },
        }).sort({ createdAt: -1 });
        return res.status(200).json({ likedPost });
    }
    catch (error) {
        return res.status(500).json({ error: "서버 내부 오류" });
    }
});
exports.getLikedPost = getLikedPost;
