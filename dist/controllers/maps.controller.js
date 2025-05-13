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
exports.createMap = exports.getMaps = void 0;
const map_model_1 = __importDefault(require("@models/map.model"));
const index_1 = require("@db/index");
const response_dto_1 = require("@dto/response.dto");
const getMaps = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, index_1.connectDB)();
        const maps = yield map_model_1.default.find();
        return res
            .status(200)
            .json((0, response_dto_1.successResponse)("성공적으로 맵 리스트를 가져왔습니다.", maps));
    }
    catch (error) {
        return res.status(500).json((0, response_dto_1.errorResponse)("서버 내부 오류"));
    }
});
exports.getMaps = getMaps;
const createMap = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, thumbnail, source } = req.body;
    try {
        yield (0, index_1.connectDB)();
        const map = yield map_model_1.default.create({
            name,
            thumbnail,
            source,
        });
        return res
            .status(200)
            .json((0, response_dto_1.successResponse)("성공적으로 맵을 생성했습니다.", map));
    }
    catch (error) {
        return res.status(500).json((0, response_dto_1.errorResponse)("서버 내부 오류"));
    }
});
exports.createMap = createMap;
