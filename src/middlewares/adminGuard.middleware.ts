import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { CustomError } from "src/errors/CustomError";
import { errorResponse } from "../dto/response.dto";

export interface CustomRequest extends Request {
  auth?: string | JwtPayload;
}

export const adminGuardMiddleware = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization as string;
    const secretKey = process.env.SECRET_KEY as string;

    req.auth = jwt.verify(token, secretKey) as JwtPayload;

    if (req.auth.role !== "admin") {
      throw new CustomError("접근 권한이 없습니다.", 409);
    }

    return next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(419).json(errorResponse("토큰이 만료되었습니다."));
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json(errorResponse("유효하지 않은 토큰입니다."));
    }

    if (error instanceof CustomError) {
      return res.status(error.statusCode).json(errorResponse(error.message));
    }

    return res.status(500).json(errorResponse("서버 내부 오류"));
  }
};
