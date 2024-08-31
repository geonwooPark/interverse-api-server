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
exports.getNewPostings = exports.updatePosting = exports.deletePosting = exports.createPosting = exports.getSinglePosting = exports.getAllPosting = void 0;
const posting_model_1 = __importDefault(require("../models/posting.model"));
const comment_model_1 = __importDefault(require("../models/comment.model"));
const replyComment_model_1 = __importDefault(require("../models/replyComment.model"));
const like_model_1 = __importDefault(require("../models/like.model"));
const db_1 = require("../db");
const getAllPosting = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, db_1.connectDB)();
        const postings = yield posting_model_1.default.find({});
        return res.status(200).json({ postings });
    }
    catch (error) {
        return res.status(500).json({ error: "서버 내부 오류" });
    }
});
exports.getAllPosting = getAllPosting;
const getSinglePosting = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { postingId } = req.params;
    if (!postingId) {
        return res.status(400).json({ error: "id를 제공해주세요." });
    }
    try {
        yield (0, db_1.connectDB)();
        const posting = yield posting_model_1.default.findByIdAndUpdate({
            _id: postingId,
        }, {
            $inc: { views: 1 },
        });
        if (!posting) {
            return res.status(404).json({ error: "게시글을 찾을 수 없습니다." });
        }
        return res.status(200).json({ posting });
    }
    catch (error) {
        return res.status(500).json({ error: "서버 내부 오류" });
    }
});
exports.getSinglePosting = getSinglePosting;
const createPosting = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { category, title, description } = req.body;
    if (!category) {
        return res.status(406).json({ error: "카테고리를 입력해주세요." });
    }
    if (!title) {
        return res.status(406).json({ error: "제목을 입력해주세요." });
    }
    if (title.length > 40) {
        return res.status(406).json({ error: "제목은 40자 이하로 입력해주세요." });
    }
    if (description && description.length > 90) {
        return res.status(406).json({ error: "설명은 90자 이하로 입력해주세요." });
    }
    try {
        yield (0, db_1.connectDB)();
        const newPosting = yield posting_model_1.default.create(req.body);
        yield Promise.all([
            comment_model_1.default.create({
                parentId: newPosting._id,
                title: newPosting.title,
            }),
            replyComment_model_1.default.create({
                parentId: newPosting._id,
                title: newPosting.title,
            }),
            like_model_1.default.create({
                parentId: newPosting._id,
                title: newPosting.title,
            }),
        ]);
        return res.status(201).json({ newPosting });
    }
    catch (error) {
        return res.status(500).json({ error: "서버 내부 오류" });
    }
});
exports.createPosting = createPosting;
const deletePosting = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { postingId } = req.params;
    try {
        yield (0, db_1.connectDB)();
        yield posting_model_1.default.findByIdAndDelete(postingId);
        yield Promise.all([
            comment_model_1.default.findOneAndDelete({ parentId: postingId }),
            replyComment_model_1.default.findOneAndDelete({ parentId: postingId }),
            like_model_1.default.findOneAndDelete({ parentId: postingId }),
        ]);
        return res.status(200).json({ deletedId: postingId });
    }
    catch (error) {
        return res.status(500).json({ error: "서버 내부 오류" });
    }
});
exports.deletePosting = deletePosting;
const updatePosting = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { postingId } = req.params;
    const { category, title, description } = req.body;
    if (!category) {
        return res.status(406).json({ error: "카테고리를 입력해주세요." });
    }
    if (!title) {
        return res.status(406).json({ error: "제목을 입력해주세요." });
    }
    if (title.length > 40) {
        return res.status(406).json({ error: "제목은 40자 이하로 입력해주세요." });
    }
    if (description && description.length > 90) {
        return res.status(406).json({ error: "설명은 90자 이하로 입력해주세요." });
    }
    try {
        yield (0, db_1.connectDB)();
        const updateResult = yield posting_model_1.default.updateOne({ _id: postingId }, Object.assign({}, req.body));
        if (updateResult.modifiedCount === 0) {
            return res
                .status(404)
                .json({ error: "해당 게시글을 찾을 수 없거나 수정되지 않았습니다." });
        }
        return res.status(200).json({ message: "글 수정 성공!" });
    }
    catch (error) {
        return res.status(500).json({ error: "서버 내부 오류" });
    }
});
exports.updatePosting = updatePosting;
const getNewPostings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit } = req.query;
    try {
        yield (0, db_1.connectDB)();
        const postings = yield posting_model_1.default.find({})
            .sort({
            createdAt: -1,
        })
            .limit(parseInt(limit) || 5);
        return res.status(200).json({ postings });
    }
    catch (error) {
        return res.status(500).json({ error: "서버 내부 오류" });
    }
});
exports.getNewPostings = getNewPostings;
