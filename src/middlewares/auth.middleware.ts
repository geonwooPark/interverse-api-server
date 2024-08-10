import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

interface CustomRequest extends Request {
  decoded?: string | JwtPayload;
}

export const authMiddleware: RequestHandler = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization as string;
    const secretKey = process.env.SECRET_KEY as string;

    req.decoded = jwt.verify(token, secretKey);

    return next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(419).json({ message: "토큰이 만료되었습니다." });
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: "유효하지 않은 토큰입니다." });
    }

    return res.status(500).json({ message: "서버 오류입니다." });
  }
};
