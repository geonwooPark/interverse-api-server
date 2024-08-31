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
exports.updateCheckitem = exports.deleteCheckitem = exports.createCheckitem = exports.getChecklist = void 0;
const checklist_model_1 = __importDefault(require("../models/checklist.model"));
const uuid_1 = require("uuid");
const dayjs_1 = __importDefault(require("dayjs"));
const db_1 = require("../db");
const getChecklist = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { date } = req.params;
    try {
        yield (0, db_1.connectDB)();
        const result = yield checklist_model_1.default.findOne({
            date,
        });
        if (!result || !result.list) {
            return res.status(200).json({ result: [] });
        }
        const checklist = result.list.reverse();
        return res.status(200).json({ checklist });
    }
    catch (error) {
        return res.status(500).json({ error: "서버 내부 오류" });
    }
});
exports.getChecklist = getChecklist;
const createCheckitem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { value: text } = req.body;
    const today = (0, dayjs_1.default)().format("YYYY-MM-DD");
    if (!text) {
        return res.status(400).json({ error: "할 일을 입력해주세요." });
    }
    try {
        yield (0, db_1.connectDB)();
        yield checklist_model_1.default.updateOne({
            date: today,
        }, {
            $push: {
                list: {
                    id: (0, uuid_1.v4)(),
                    text,
                    status: false,
                },
            },
        }, { upsert: true });
        return res.status(201).json({ message: "리스트 추가 성공!" });
    }
    catch (error) {
        return res.status(500).json({ error: "서버 내부 오류" });
    }
});
exports.createCheckitem = createCheckitem;
const deleteCheckitem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { itemId } = req.body;
    const today = (0, dayjs_1.default)().format("YYYY-MM-DD");
    try {
        yield (0, db_1.connectDB)();
        yield checklist_model_1.default.updateOne({
            date: today,
        }, { $pull: { list: { id: itemId } } });
        return res.status(200).json({ deletedId: itemId });
    }
    catch (error) {
        return res.status(500).json({ error: "서버 내부 오류" });
    }
});
exports.deleteCheckitem = deleteCheckitem;
const updateCheckitem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { itemId, status } = req.body;
    const today = (0, dayjs_1.default)().format("YYYY-MM-DD");
    try {
        yield (0, db_1.connectDB)();
        yield checklist_model_1.default.updateOne({
            date: today,
        }, { $set: { "list.$[elem].status": !status } }, { arrayFilters: [{ "elem.id": itemId }] });
        return res.status(200).json({ message: "리스트 상태 변경 성공!" });
    }
    catch (error) {
        return res.status(500).json({ error: "서버 내부 오류" });
    }
});
exports.updateCheckitem = updateCheckitem;
