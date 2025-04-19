type SuccessResponse<T> = {
  message: String;
  data: T;
};

type ErrorResponse<T> = {
  message: String;
  data: null;
};

export const successResponse = <T>(
  message: string,
  data: T
): SuccessResponse<T> => {
  return {
    message,
    data,
  };
};

export const errorResponse = <T>(message: string): ErrorResponse<T> => {
  return {
    message,
    data: null,
  };
};
