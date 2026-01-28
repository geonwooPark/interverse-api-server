import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Reflector } from "@nestjs/core";
import { RESPONSE_MESSAGE_KEY } from "../decorators/response-message.decorator";

export interface Response<T> {
  message: string;
  data: T;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  constructor(private reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Observable<Response<T>> {
    const responseMessage = this.reflector.getAllAndOverride<string>(
      RESPONSE_MESSAGE_KEY,
      [context.getHandler(), context.getClass()]
    );

    return next.handle().pipe(
      map((data) => {
        // 이미 { message, data } 형식인 경우 그대로 반환
        if (
          data &&
          typeof data === "object" &&
          "message" in data &&
          "data" in data
        ) {
          return data;
        }

        // 메시지가 데코레이터로 지정된 경우 사용, 없으면 기본 메시지
        const message = responseMessage || "요청이 성공적으로 처리되었습니다.";

        return {
          message,
          data,
        };
      })
    );
  }
}
