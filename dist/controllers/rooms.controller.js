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
exports.checkPassword = exports.deleteRoom = exports.createRoom = exports.joinRoom = exports.getSingleRoom = exports.getRooms = void 0;
const map_model_1 = __importDefault(require("@models/map.model"));
const room_model_1 = __importDefault(require("@models/room.model"));
const roomLog_model_1 = __importDefault(require("@models/roomLog.model"));
const index_1 = require("@db/index");
const CustomError_1 = require("@errors/CustomError");
const response_dto_1 = require("@dto/response.dto");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const roomCredential_model_1 = __importDefault(require("@models/roomCredential.model"));
const getRooms = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: userId } = req.auth;
    try {
        yield (0, index_1.connectDB)();
        const logs = yield roomLog_model_1.default.find({ userId })
            .populate("room")
            .populate("map");
        return res
            .status(200)
            .json((0, response_dto_1.successResponse)("참여한 방 리스트입니다.", logs));
    }
    catch (error) {
        return res.status(500).json((0, response_dto_1.errorResponse)("서버 내부 오류"));
    }
});
exports.getRooms = getRooms;
const getSingleRoom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: userId } = req.auth;
    const { roomId } = req.params;
    try {
        yield (0, index_1.connectDB)();
        const room = yield room_model_1.default.findById(roomId);
        if (room) {
            const isHost = room.host === userId;
            return res.status(200).json((0, response_dto_1.successResponse)(`${roomId}방 정보입니다.`, Object.assign(Object.assign({}, room.toObject()), { isHost })));
        }
    }
    catch (error) {
        return res.status(500).json((0, response_dto_1.errorResponse)("서버 내부 오류"));
    }
});
exports.getSingleRoom = getSingleRoom;
const joinRoom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { roomId } = req.params;
    const { id: userId } = req.auth;
    try {
        yield (0, index_1.connectDB)();
        const room = yield room_model_1.default.findById(roomId);
        if (!room) {
            throw new CustomError_1.CustomError("방을 찾을 수 없습니다.", 404);
        }
        const existingLog = yield roomLog_model_1.default.findOne({ userId, roomId });
        if (!existingLog) {
            yield roomLog_model_1.default.create({ userId, roomId });
        }
        return res.status(200).json((0, response_dto_1.successResponse)("방에 입장했습니다.", room));
    }
    catch (error) {
        if (error instanceof CustomError_1.CustomError) {
            return res.status(error.statusCode).json((0, response_dto_1.errorResponse)(error.message));
        }
        return res.status(500).json((0, response_dto_1.errorResponse)("서버 내부 오류"));
    }
});
exports.joinRoom = joinRoom;
const createRoom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, password, headCount, mapId } = req.body;
    const { id: userId } = req.auth;
    try {
        yield (0, index_1.connectDB)();
        const hashedPassword = yield bcryptjs_1.default.hash(password, 8);
        const mapDoc = yield map_model_1.default.findOne({ _id: mapId });
        if (mapId && !mapDoc) {
            throw new CustomError_1.CustomError("맵을 찾을 수 없습니다.", 400);
        }
        const newRoom = yield room_model_1.default.create({
            title,
            headCount,
            mapId: mapDoc === null || mapDoc === void 0 ? void 0 : mapDoc._id,
            host: userId,
        });
        yield roomCredential_model_1.default.create({
            roomId: newRoom._id,
            password: hashedPassword,
        });
        yield roomLog_model_1.default.create({ userId, room: newRoom.id, map: mapDoc === null || mapDoc === void 0 ? void 0 : mapDoc._id });
        return res
            .status(201)
            .json((0, response_dto_1.successResponse)("방이 생성되었습니다.", newRoom));
    }
    catch (error) {
        if (error instanceof CustomError_1.CustomError) {
            return res.status(error.statusCode).json((0, response_dto_1.errorResponse)(error.message));
        }
        return res.status(500).json((0, response_dto_1.errorResponse)("서버 내부 오류"));
    }
});
exports.createRoom = createRoom;
const deleteRoom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { roomId } = req.params;
    const { id: userId } = req.auth;
    try {
        yield (0, index_1.connectDB)();
        const room = yield room_model_1.default.findById(roomId);
        if (!room) {
            throw new CustomError_1.CustomError("해당 방을 찾을 수 없습니다.", 404);
        }
        if (userId !== room.host) {
            throw new CustomError_1.CustomError("해당 방을 삭제할 권한이 없습니다.", 403);
        }
        yield Promise.all([
            room_model_1.default.deleteOne({ _id: roomId }),
            roomCredential_model_1.default.deleteOne({ roomId }),
            roomLog_model_1.default.deleteMany({ roomId }),
        ]);
        return res
            .status(200)
            .json((0, response_dto_1.successResponse)("방이 성공적으로 삭제되었습니다.", true));
    }
    catch (error) {
        if (error instanceof CustomError_1.CustomError) {
            return res.status(error.statusCode).json((0, response_dto_1.errorResponse)(error.message));
        }
        return res.status(500).json((0, response_dto_1.errorResponse)("서버 내부 오류"));
    }
});
exports.deleteRoom = deleteRoom;
const checkPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { roomId } = req.params;
    const { password } = req.body;
    try {
        const roomCredential = yield roomCredential_model_1.default.findOne({ roomId });
        if (!roomCredential) {
            throw new CustomError_1.CustomError("방을 찾을 수 없습니다.", 404);
        }
        const pwcheck = yield bcryptjs_1.default.compare(password, roomCredential.password);
        if (!pwcheck) {
            throw new CustomError_1.CustomError("비밀번호가 일치하지 않습니다.", 409);
        }
        return res
            .status(200)
            .json((0, response_dto_1.successResponse)("비밀번호가 일치합니다.", true));
    }
    catch (error) {
        if (error instanceof CustomError_1.CustomError) {
            return res.status(error.statusCode).json((0, response_dto_1.errorResponse)(error.message));
        }
        return res.status(500).json((0, response_dto_1.errorResponse)("서버 내부 오류"));
    }
});
exports.checkPassword = checkPassword;
