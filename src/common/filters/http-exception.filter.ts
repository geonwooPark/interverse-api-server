import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { ErrorCode } from "../../constants/error-codes";
import type { Response } from "express";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = "서버 내부 오류";
    let code: ErrorCode | null = ErrorCode.INTERNAL_SERVER_ERROR;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === "string") {
        message = exceptionResponse;
      } else if (
        typeof exceptionResponse === "object" &&
        exceptionResponse !== null
      ) {
        const responseObj = exceptionResponse as any;
        // ValidationPipe 에러는 message가 배열일 수 있음
        if (Array.isArray(responseObj.message)) {
          message = responseObj.message.join(", ");
        } else {
          message = responseObj.message || exception.message;
        }

        if (responseObj.code) {
          code = responseObj.code;
        }
      } else {
        message = exception.message;
      }
    }

    response.status(status).json({
      message,
      code,
      data: null,
    });
  }
}
