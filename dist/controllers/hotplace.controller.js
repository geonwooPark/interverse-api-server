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
exports.getAutocompleteResults = exports.updateHotplace = exports.deleteHotplace = exports.createHotplace = exports.getSingleHotplace = exports.getAllHotplace = void 0;
const hotplace_model_1 = __importDefault(require("../models/hotplace.model"));
const comment_model_1 = __importDefault(require("../models/comment.model"));
const replyComment_model_1 = __importDefault(require("../models/replyComment.model"));
const like_model_1 = __importDefault(require("../models/like.model"));
const db_1 = require("../db");
const getAllHotplace = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { keyword, category, gu } = req.body;
    const categoryArr = category === null || category === void 0 ? void 0 : category.split(",");
    const guArr = gu === null || gu === void 0 ? void 0 : gu.split(",");
    const options = [
        keyword ? { store: { $regex: new RegExp(keyword, "i") } } : {},
        category ? { category: { $in: categoryArr } } : {},
        gu ? { gu: { $in: guArr } } : {},
    ];
    try {
        yield (0, db_1.connectDB)();
        const hotplaces = yield hotplace_model_1.default.find({
            $and: options,
        }).sort({
            createdAt: -1,
        });
        return res.status(200).json({ hotplaces });
    }
    catch (error) {
        return res.status(500).json({ error: "서버 내부 오류" });
    }
});
exports.getAllHotplace = getAllHotplace;
const getSingleHotplace = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { hotplaceId } = req.params;
    if (!hotplaceId) {
        return res.status(400).json({ error: "id를 제공해주세요." });
    }
    try {
        yield (0, db_1.connectDB)();
        const hotplace = yield hotplace_model_1.default.findOne({
            _id: hotplaceId,
        });
        if (!hotplace) {
            return res.status(404).json({ error: "게시글을 찾을 수 없습니다." });
        }
        return res.status(200).json({ hotplace });
    }
    catch (error) {
        return res.status(500).json({ error: "서버 내부 오류" });
    }
});
exports.getSingleHotplace = getSingleHotplace;
const createHotplace = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, db_1.connectDB)();
        const newHotplace = yield hotplace_model_1.default.create(req.body);
        yield comment_model_1.default.create({
            parentId: newHotplace._id,
        });
        yield replyComment_model_1.default.create({
            parentId: newHotplace._id,
        });
        yield like_model_1.default.create({
            parentId: newHotplace._id,
        });
        return res.status(201).json({ newHotplace });
    }
    catch (error) {
        return res.status(500).json({ error: "서버 내부 오류" });
    }
});
exports.createHotplace = createHotplace;
const deleteHotplace = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { hotplaceId } = req.params;
    try {
        yield (0, db_1.connectDB)();
        yield hotplace_model_1.default.findByIdAndDelete(hotplaceId);
        yield Promise.all([
            comment_model_1.default.findOneAndDelete({ parentId: hotplaceId }),
            replyComment_model_1.default.findOneAndDelete({ parentId: hotplaceId }),
            like_model_1.default.findOneAndDelete({ parentId: hotplaceId }),
        ]);
        return res.status(200).json({ deletedId: hotplaceId });
    }
    catch (error) {
        return res.status(500).json({ error: "서버 내부 오류" });
    }
});
exports.deleteHotplace = deleteHotplace;
const updateHotplace = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { hotplaceId } = req.params;
    try {
        yield (0, db_1.connectDB)();
        const updateResult = yield hotplace_model_1.default.updateOne({ _id: hotplaceId }, Object.assign({}, req.body));
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
exports.updateHotplace = updateHotplace;
const getAutocompleteResults = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { keyword } = req.params;
    const regexPattern = new RegExp(`^${keyword}`, "i");
    try {
        yield (0, db_1.connectDB)();
        const hotplaces = yield hotplace_model_1.default.find({
            store: { $regex: regexPattern },
        }).limit(5);
        return res.status(200).json({ hotplaces });
    }
    catch (error) {
        return res.status(500).json({ error: "서버 내부 오류" });
    }
});
exports.getAutocompleteResults = getAutocompleteResults;
