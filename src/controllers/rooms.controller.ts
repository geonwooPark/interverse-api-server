import { RequestHandler } from "express";
import Map from "@models/map.model";
import Room from "@models/room.model";
import RoomLog from "@models/roomLog.model";
import { JwtPayload } from "jsonwebtoken";
import { connectDB } from "@db/index";
import { CustomError } from "@errors/CustomError";
import { errorResponse, successResponse } from "@dto/response.dto";
import bcryptjs from "bcryptjs";
import RoomCredential from "@models/roomCredential.model";

export const getRooms: RequestHandler = async (req: JwtPayload, res) => {
  const { id: userId } = req.auth;

  try {
    await connectDB();

    const logs = await RoomLog.find({ userId })
      .populate("room")
      .populate("map");

    return res
      .status(200)
      .json(successResponse("참여한 방 리스트입니다.", logs));
  } catch (error) {
    return res.status(500).json(errorResponse("서버 내부 오류"));
  }
};

export const getSingleRoom: RequestHandler = async (req: JwtPayload, res) => {
  const { id: userId } = req.auth;

  const { roomId } = req.params;

  try {
    await connectDB();

    const room = await Room.findById(roomId);

    if (room) {
      const isHost = room.host === userId;

      return res.status(200).json(
        successResponse(`${roomId}방 정보입니다.`, {
          ...room.toObject(),
          isHost,
        })
      );
    }
  } catch (error) {
    return res.status(500).json(errorResponse("서버 내부 오류"));
  }
};

export const joinRoom: RequestHandler = async (req: JwtPayload, res) => {
  const { roomId } = req.params;

  const { id: userId } = req.auth;

  try {
    await connectDB();

    const room = await Room.findById(roomId);

    if (!room) {
      throw new CustomError("방을 찾을 수 없습니다.", 404);
    }

    const existingLog = await RoomLog.findOne({ userId, roomId });
    if (!existingLog) {
      await RoomLog.create({ userId, roomId });
    }

    return res.status(200).json(successResponse("방에 입장했습니다.", room));
  } catch (error) {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json(errorResponse(error.message));
    }

    return res.status(500).json(errorResponse("서버 내부 오류"));
  }
};

export const createRoom: RequestHandler = async (req: JwtPayload, res) => {
  const { title, password, headCount, mapSrc } = req.body;

  const { id: userId } = req.auth;

  try {
    await connectDB();

    const hashedPassword = await bcryptjs.hash(password, 8);

    const mapDoc = await Map.findOne({ mapSrc });
    if (mapSrc && !mapDoc) {
      throw new CustomError("맵을 찾을 수 없습니다.", 400);
    }
    const newRoom = await Room.create({
      title,
      headCount,
      mapSrc: mapDoc?.mapSrc,
      host: userId,
    });

    await RoomCredential.create({
      roomId: newRoom._id,
      password: hashedPassword,
    });

    await RoomLog.create({ userId, room: newRoom.id, map: mapDoc?._id });

    return res
      .status(201)
      .json(
        successResponse(
          "함께할 준비 되셨나요? 새로운 방이 시작됐어요!",
          newRoom
        )
      );
  } catch (error) {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json(errorResponse(error.message));
    }

    return res.status(500).json(errorResponse("서버 내부 오류"));
  }
};

export const deleteRoom: RequestHandler = async (req: JwtPayload, res) => {
  const { roomId } = req.params;

  const { id: userId } = req.auth;

  try {
    await connectDB();

    const room = await Room.findById(roomId);

    if (!room) {
      throw new CustomError("해당 방을 찾을 수 없습니다.", 404);
    }

    if (userId !== room.host) {
      throw new CustomError("해당 방을 삭제할 권한이 없습니다.", 403);
    }

    await Promise.all([
      Room.deleteOne({ _id: roomId }),
      RoomCredential.deleteOne({ roomId }),
      RoomLog.deleteMany({ room: roomId }),
    ]);

    return res
      .status(200)
      .json(successResponse("방이 성공적으로 삭제되었습니다.", true));
  } catch (error) {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json(errorResponse(error.message));
    }

    return res.status(500).json(errorResponse("서버 내부 오류"));
  }
};

export const checkPassword: RequestHandler = async (req, res) => {
  const { roomId } = req.params;

  const { password } = req.body;

  try {
    const roomCredential = await RoomCredential.findOne({ roomId });

    if (!roomCredential) {
      throw new CustomError("방을 찾을 수 없습니다.", 404);
    }

    const pwcheck = await bcryptjs.compare(password, roomCredential.password);
    if (!pwcheck) {
      throw new CustomError("비밀번호가 일치하지 않습니다.", 409);
    }

    return res
      .status(200)
      .json(successResponse("비밀번호가 일치합니다.", true));
  } catch (error) {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json(errorResponse(error.message));
    }

    return res.status(500).json(errorResponse("서버 내부 오류"));
  }
};
