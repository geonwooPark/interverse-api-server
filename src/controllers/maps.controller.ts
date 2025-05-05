import { RequestHandler } from "express";
import Map from "../models/map.model";
import { connectDB } from "../db";
import { errorResponse, successResponse } from "../dto/response.dto";

export const getMaps: RequestHandler = async (req, res) => {
  try {
    await connectDB();

    const maps = await Map.find();

    return res
      .status(200)
      .json(successResponse("성공적으로 맵 리스트를 가져왔습니다.", maps));
  } catch (error) {
    return res.status(500).json(errorResponse("서버 내부 오류"));
  }
};

export const createMap: RequestHandler = async (req, res) => {
  const { name, thumbnail, source } = req.body;

  try {
    await connectDB();

    const map = await Map.create({
      name,
      thumbnail,
      source,
    });

    return res
      .status(200)
      .json(successResponse("성공적으로 맵을 생성했습니다.", map));
  } catch (error) {
    return res.status(500).json(errorResponse("서버 내부 오류"));
  }
};
