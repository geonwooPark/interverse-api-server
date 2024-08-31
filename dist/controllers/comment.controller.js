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
exports.updateComment = exports.deleteComment = exports.createComment = exports.getComments = void 0;
const comment_model_1 = __importDefault(require("../models/comment.model"));
const replyComment_model_1 = __importDefault(require("../models/replyComment.model"));
const posting_model_1 = __importDefault(require("../models/posting.model"));
const uuid_1 = require("uuid");
const db_1 = require("../db");
const getComments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { parentId } = req.params;
    try {
        yield (0, db_1.connectDB)();
        const comments = yield comment_model_1.default.findOne({ parentId });
        return res
            .status(200)
            .json({ comments: comments ? comments.comments : [] });
    }
    catch (error) {
        return res.status(500).json({ error: "서버 내부 오류" });
    }
});
exports.getComments = getComments;
const createComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { parentId, content } = req.body;
    try {
        yield (0, db_1.connectDB)();
        const [updatedComment] = yield Promise.all([
            comment_model_1.default.findOneAndUpdate({ parentId }, {
                $push: {
                    comments: {
                        commentId: (0, uuid_1.v4)(),
                        user: {
                            userImage: "",
                            userId: "",
                            userName: "",
                        },
                        createdAt: new Date(),
                        content,
                        likeCount: 0,
                        isDeleted: false,
                    },
                },
            }, { new: true, upsert: true }),
            posting_model_1.default.findByIdAndUpdate({
                _id: parentId,
            }, {
                $inc: { commentCount: 1 },
            }),
        ]);
        return res.status(201).json({ updatedComment });
    }
    catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
});
exports.createComment = createComment;
const deleteComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { commentId } = req.params;
    const { parentId } = req.body;
    try {
        yield (0, db_1.connectDB)();
        const replyComment = yield replyComment_model_1.default.findOne({
            parentId,
        }, {
            comments: {
                $elemMatch: {
                    commentId,
                },
            },
        });
        yield Promise.all([
            (replyComment === null || replyComment === void 0 ? void 0 : replyComment.comments.length) !== 0
                ? comment_model_1.default.findOneAndUpdate({
                    parentId,
                }, { $set: { "comments.$[elem].isDeleted": true } }, { arrayFilters: [{ "elem.commentId": commentId }] })
                : comment_model_1.default.findOneAndUpdate({
                    parentId,
                }, { $pull: { comments: { commentId } } }),
            posting_model_1.default.findByIdAndUpdate({
                _id: parentId,
            }, {
                $inc: { commentCount: -1 },
            }),
        ]);
        return res.status(200).json({ deletedId: parentId });
    }
    catch (error) {
        return res.status(500).json({ error: "서버 내부 오류" });
    }
});
exports.deleteComment = deleteComment;
const updateComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { commentId } = req.params;
    const { parentId, content } = req.body;
    try {
        yield (0, db_1.connectDB)();
        yield comment_model_1.default.findOneAndUpdate({
            parentId,
        }, { $set: { "comments.$[elem].content": content } }, { arrayFilters: [{ "elem.commentId": commentId }] });
        return res.status(200).json({ message: "댓글 수정 성공!" });
    }
    catch (error) {
        return res.status(500).json({ error: "서버 내부 오류" });
    }
});
exports.updateComment = updateComment;
