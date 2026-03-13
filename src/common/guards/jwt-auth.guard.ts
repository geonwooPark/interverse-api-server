import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  HttpException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

const TOKEN_EXPIRED_STATUS = 419;

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(" ")[1];

    if (!token) {
      throw new UnauthorizedException("인증이 필요합니다.");
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);
      request.user = payload;
      return true;
    } catch (error: any) {
      if (error?.name === "TokenExpiredError") {
        throw new HttpException("토큰이 만료되었습니다.", TOKEN_EXPIRED_STATUS);
      }
      throw new UnauthorizedException("유효하지 않은 토큰입니다.");
    }
  }
}
