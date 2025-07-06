import jwt from "jsonwebtoken";

export const getAccessToken = (payload: any) => {
  return jwt.sign(payload, process.env.JWT_SECRET_KEY as string, {
    expiresIn: "30m",
  });
};

export const getRefreshToken = (payload: any) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET as string, {
    expiresIn: "7d",
  });
};
