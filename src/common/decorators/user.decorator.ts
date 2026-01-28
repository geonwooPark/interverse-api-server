import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export interface JwtPayload {
  id: string;
  email: string;
  role: "admin" | "user";
  profile?: string;
}

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): JwtPayload => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as JwtPayload;
  }
);
