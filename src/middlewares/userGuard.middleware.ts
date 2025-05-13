import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { errorResponse } from "@dto/response.dto";

export interface CustomRequest extends Request {
  auth?: JwtPayload;
}

export const userGuardMiddleware = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1] as string;
    const secretKey = process.env.JWT_SECRET_KEY as string;

    req.auth = jwt.verify(token, secretKey) as JwtPayload;

    return next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(419).json(errorResponse("토큰이 만료되었습니다."));
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json(errorResponse("유효하지 않은 토큰입니다."));
    }

    return res.status(500).json(errorResponse("서버 내부 오류"));
  }
};
