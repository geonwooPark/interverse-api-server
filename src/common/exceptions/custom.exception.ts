import { HttpException } from "@nestjs/common";
import {
  ErrorCode,
  ERROR_MESSAGES,
  ERROR_CODE_TO_STATUS,
} from "../../constants/error-codes";

export class CustomException extends HttpException {
  constructor(code: ErrorCode, customMessage?: string) {
    const status = ERROR_CODE_TO_STATUS[code];

    const message = customMessage ?? ERROR_MESSAGES[code];

    super({ message, code }, status);
  }
}
