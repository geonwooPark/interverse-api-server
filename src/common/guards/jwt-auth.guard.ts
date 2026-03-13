import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ErrorCode } from "../../constants/error-codes";
import { CustomException } from "../exceptions/custom.exception";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(" ")[1];

    if (!token) {
      throw new CustomException(ErrorCode.UNAUTHORIZED);
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);
      request.user = payload;
      return true;
    } catch (error: any) {
      if (error?.name === "TokenExpiredError") {
        throw new CustomException(ErrorCode.ACCESS_TOKEN_EXPIRED);
      }
      throw new CustomException(
        ErrorCode.UNAUTHORIZED,
        "유효하지 않은 토큰입니다.",
      );
    }
  }
}
