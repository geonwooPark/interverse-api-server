export enum ErrorCode {
  // 공통
  INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
  BAD_REQUEST = "BAD_REQUEST",
  UNAUTHORIZED = "UNAUTHORIZED",
  FORBIDDEN = "FORBIDDEN",
  NOT_FOUND = "NOT_FOUND",
  CONFLICT = "CONFLICT",
  TOO_MANY_REQUESTS = "TOO_MANY_REQUESTS",

  // 인증/회원
  USER_ALREADY_EXISTS = "USER_ALREADY_EXISTS",
  USER_NOT_FOUND = "USER_NOT_FOUND",
  INVALID_PASSWORD = "INVALID_PASSWORD",
  OAUTH_PASSWORD_LOGIN_NOT_ALLOWED = "OAUTH_PASSWORD_LOGIN_NOT_ALLOWED",
  REFRESH_TOKEN_INVALID = "REFRESH_TOKEN_INVALID",
  ACCESS_TOKEN_EXPIRED = "ACCESS_TOKEN_EXPIRED",
  EMAIL_NOT_AVAILABLE = "EMAIL_NOT_AVAILABLE",
  VERIFICATION_FAILED = "VERIFICATION_FAILED",
  VERIFICATION_CODE_EXPIRED = "VERIFICATION_CODE_EXPIRED",

  // 방/룸
  ROOM_NOT_FOUND = "ROOM_NOT_FOUND",
  ROOM_DELETE_FORBIDDEN = "ROOM_DELETE_FORBIDDEN",
  ROOM_PASSWORD_MISMATCH = "ROOM_PASSWORD_MISMATCH",
  MAP_NOT_FOUND = "MAP_NOT_FOUND",
}

export const ERROR_MESSAGES: Record<ErrorCode, string> = {
  [ErrorCode.INTERNAL_SERVER_ERROR]: "서버 내부 오류",
  [ErrorCode.BAD_REQUEST]: "잘못된 요청입니다.",
  [ErrorCode.UNAUTHORIZED]: "인증이 필요합니다.",
  [ErrorCode.FORBIDDEN]: "접근 권한이 없습니다.",
  [ErrorCode.NOT_FOUND]: "요청한 리소스를 찾을 수 없습니다.",
  [ErrorCode.CONFLICT]: "요청이 현재 서버 상태와 충돌합니다.",
  [ErrorCode.TOO_MANY_REQUESTS]:
    "요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.",

  [ErrorCode.USER_ALREADY_EXISTS]: "이미 존재하는 이메일입니다.",
  [ErrorCode.USER_NOT_FOUND]: "존재하지 않는 회원입니다.",
  [ErrorCode.INVALID_PASSWORD]: "잘못된 비밀번호입니다.",
  [ErrorCode.OAUTH_PASSWORD_LOGIN_NOT_ALLOWED]:
    "OAuth 사용자는 비밀번호 로그인이 불가능합니다.",
  [ErrorCode.REFRESH_TOKEN_INVALID]: "리프레시 토큰이 유효하지 않습니다.",
  [ErrorCode.ACCESS_TOKEN_EXPIRED]: "토큰이 만료되었습니다.",
  [ErrorCode.EMAIL_NOT_AVAILABLE]: "가입이 불가능한 이메일입니다.",
  [ErrorCode.VERIFICATION_FAILED]: "인증에 실패했습니다.",
  [ErrorCode.VERIFICATION_CODE_EXPIRED]: "인증 코드가 만료되었습니다.",

  [ErrorCode.ROOM_NOT_FOUND]: "방을 찾을 수 없습니다.",
  [ErrorCode.ROOM_DELETE_FORBIDDEN]: "해당 방을 삭제할 권한이 없습니다.",
  [ErrorCode.ROOM_PASSWORD_MISMATCH]: "비밀번호가 일치하지 않습니다.",
  [ErrorCode.MAP_NOT_FOUND]: "맵을 찾을 수 없습니다.",
};

export const ERROR_CODE_TO_STATUS: Record<ErrorCode, number> = {
  [ErrorCode.INTERNAL_SERVER_ERROR]: 500,
  [ErrorCode.BAD_REQUEST]: 400,
  [ErrorCode.UNAUTHORIZED]: 401,
  [ErrorCode.FORBIDDEN]: 403,
  [ErrorCode.NOT_FOUND]: 404,
  [ErrorCode.CONFLICT]: 409,
  [ErrorCode.TOO_MANY_REQUESTS]: 429,

  [ErrorCode.USER_ALREADY_EXISTS]: 409,
  [ErrorCode.USER_NOT_FOUND]: 404,
  [ErrorCode.INVALID_PASSWORD]: 409,
  [ErrorCode.OAUTH_PASSWORD_LOGIN_NOT_ALLOWED]: 401,
  [ErrorCode.REFRESH_TOKEN_INVALID]: 401,
  [ErrorCode.ACCESS_TOKEN_EXPIRED]: 419,
  [ErrorCode.EMAIL_NOT_AVAILABLE]: 409,
  [ErrorCode.VERIFICATION_FAILED]: 401,
  [ErrorCode.VERIFICATION_CODE_EXPIRED]: 401,

  [ErrorCode.ROOM_NOT_FOUND]: 404,
  [ErrorCode.ROOM_DELETE_FORBIDDEN]: 403,
  [ErrorCode.ROOM_PASSWORD_MISMATCH]: 409,
  [ErrorCode.MAP_NOT_FOUND]: 400,
};
