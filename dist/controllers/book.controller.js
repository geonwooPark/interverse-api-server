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
exports.updateBook = exports.deleteBook = exports.createBook = exports.getSingleBook = exports.getAllBook = void 0;
const book_model_1 = __importDefault(require("../models/book.model"));
const comment_model_1 = __importDefault(require("../models/comment.model"));
const replyComment_model_1 = __importDefault(require("../models/replyComment.model"));
const like_model_1 = __importDefault(require("../models/like.model"));
const db_1 = require("../db");
const getAllBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, db_1.connectDB)();
        const books = yield book_model_1.default.find({});
        return res.status(200).json({ books });
    }
    catch (error) {
        return res.status(500).json({ error: "서버 내부 오류" });
    }
});
exports.getAllBook = getAllBook;
const getSingleBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { bookId } = req.params;
    if (!bookId) {
        return res.status(400).json({ error: "id를 제공해주세요." });
    }
    try {
        yield (0, db_1.connectDB)();
        const book = yield book_model_1.default.findOne({
            _id: bookId,
        });
        if (!book) {
            return res.status(404).json({ error: "게시글을 찾을 수 없습니다." });
        }
        return res.status(200).json({ book });
    }
    catch (error) {
        return res.status(500).json({ error: "서버 내부 오류" });
    }
});
exports.getSingleBook = getSingleBook;
const createBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, db_1.connectDB)();
        const newBook = yield book_model_1.default.create(req.body);
        yield comment_model_1.default.create({
            parentId: newBook._id,
        });
        yield replyComment_model_1.default.create({
            parentId: newBook._id,
        });
        yield like_model_1.default.create({
            parentId: newBook._id,
        });
        return res.status(201).json({ newBook });
    }
    catch (error) {
        return res.status(500).json({ error: "서버 내부 오류" });
    }
});
exports.createBook = createBook;
const deleteBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { bookId } = req.params;
    try {
        yield (0, db_1.connectDB)();
        yield book_model_1.default.findByIdAndDelete(bookId);
        yield Promise.all([
            comment_model_1.default.findOneAndDelete({ parentId: bookId }),
            replyComment_model_1.default.findOneAndDelete({ parentId: bookId }),
            like_model_1.default.findOneAndDelete({ parentId: bookId }),
        ]);
        return res.status(200).json({ deletedId: bookId });
    }
    catch (error) {
        return res.status(500).json({ error: "서버 내부 오류" });
    }
});
exports.deleteBook = deleteBook;
const updateBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { bookId } = req.params;
    try {
        yield (0, db_1.connectDB)();
        const updateResult = yield book_model_1.default.updateOne({ _id: bookId }, Object.assign({}, req.body));
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
exports.updateBook = updateBook;
