import { RequestHandler } from "express";
import Room from "../models/room.model";
import RoomLog from "../models/roomLog.model";
import { JwtPayload } from "jsonwebtoken";
import { connectDB } from "../db";
import { CustomError } from "../errors/CustomError";
import { errorResponse, successResponse } from "../dto/response.dto";

export const getRooms: RequestHandler = async (req: JwtPayload, res) => {
  const { id: userId } = req.auth;

  try {
    await connectDB();

    const logs = await RoomLog.find({ userId }).populate("roomId");

    return res
      .status(200)
      .json(successResponse("참여한 방 리스트입니다.", logs));
  } catch (error) {
    return res.status(500).json(errorResponse("서버 내부 오류"));
  }
};

export const joinRoom: RequestHandler = async (req: JwtPayload, res) => {
  const { roomId } = req.params;

  const { id: userId } = req.auth;

  const { password } = req.body;

  try {
    await connectDB();

    const room = await Room.findById(roomId);

    if (!room) {
      throw new CustomError("방을 찾을 수 없습니다.", 404);
    }

    if (password !== room.password) {
      throw new CustomError("비밀번호가 일치하지 않습니다.", 401);
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
  const { title, password, headCount } = req.body;

  const { id: userId } = req.auth;

  try {
    await connectDB();

    const newRoom = await Room.create({
      title,
      password,
      headCount,
      host: userId,
    });

    return res
      .status(201)
      .json(successResponse("방이 생성되었습니다.", newRoom));
  } catch (error) {
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
      RoomLog.deleteMany({ roomId }),
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
