import { RequestHandler } from "express";
import Map from "@models/map.model";
import Character from "@models/character.model";
import { connectDB } from "@db/index";
import { errorResponse, successResponse } from "@dto/response.dto";

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
  const { name, thumbnail, mapSrc } = req.body;

  try {
    await connectDB();

    const map = await Map.create({
      name,
      thumbnail,
      mapSrc,
    });

    return res
      .status(200)
      .json(successResponse("성공적으로 맵을 생성했습니다.", map));
  } catch (error) {
    return res.status(500).json(errorResponse("서버 내부 오류"));
  }
};

export const getCharacters: RequestHandler = async (req, res) => {
  try {
    await connectDB();

    const characters = await Character.find();

    return res
      .status(200)
      .json(
        successResponse("성공적으로 캐릭터 리스트를 가져왔습니다.", characters)
      );
  } catch (error) {
    return res.status(500).json(errorResponse("서버 내부 오류"));
  }
};

export const createCharacter: RequestHandler = async (req, res) => {
  const { name, source, width, height } = req.body;

  try {
    await connectDB();

    const character = await Character.create({
      name,
      source,
      width,
      height,
    });

    return res
      .status(200)
      .json(successResponse("성공적으로 캐릭터를 생성했습니다.", character));
  } catch (error) {
    return res.status(500).json(errorResponse("서버 내부 오류"));
  }
};
