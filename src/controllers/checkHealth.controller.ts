import { connectDB } from "@db/index";
import { errorResponse, successResponse } from "@dto/response.dto";
import { RequestHandler } from "express";
import mongoose from "mongoose";

export const checkHealth: RequestHandler = async (req, res) => {
  try {
    await connectDB();

    await mongoose.connection.db.admin().ping();

    return res.status(200).json(
      successResponse("", {
        status: "ok",
      })
    );
  } catch (error) {
    return res.status(500).json(errorResponse("서버 내부 오류"));
  }
};
