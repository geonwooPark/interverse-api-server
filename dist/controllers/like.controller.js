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
exports.toggleLike = exports.getLikeUsers = void 0;
const like_model_1 = __importDefault(require("../models/like.model"));
const posting_model_1 = __importDefault(require("../models/posting.model"));
const db_1 = require("../db");
const getLikeUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { parentId } = req.params;
    try {
        yield (0, db_1.connectDB)();
        const likes = yield like_model_1.default.findOne({ parentId });
        return res.status(200).json({ likes: likes || [] });
    }
    catch (error) {
        return res.status(500).json({ error: "서버 내부 오류" });
    }
});
exports.getLikeUsers = getLikeUsers;
const toggleLike = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { parentId } = req.params;
    const { userId, userImage, userName } = req.body;
    try {
        yield (0, db_1.connectDB)();
        const likes = yield like_model_1.default.findOne({ parentId });
        if (!likes) {
            return res
                .status(404)
                .json({ error: "좋아요 엔티티를 찾을 수 없습니다." });
        }
        const isLike = likes.likes.some((user) => user.userId === userId);
        if (isLike) {
            yield Promise.all([
                like_model_1.default.updateOne({
                    parentId,
                }, { $pull: { likes: req.body } }),
                posting_model_1.default.findByIdAndUpdate({
                    _id: parentId,
                }, {
                    $inc: { likeCount: -1 },
                }),
            ]);
        }
        else {
            yield Promise.all([
                like_model_1.default.updateOne({
                    parentId,
                }, { $push: { likes: req.body } }),
                posting_model_1.default.findByIdAndUpdate({
                    _id: parentId,
                }, {
                    $inc: { likeCount: 1 },
                }),
            ]);
        }
        return res.status(200).json({ isLike: !isLike });
    }
    catch (error) {
        return res.status(500).json({ error: "서버 내부 오류" });
    }
});
exports.toggleLike = toggleLike;
