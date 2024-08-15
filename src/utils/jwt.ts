import jwt from "jsonwebtoken";

export const getToken = (payload: any) => {
  return jwt.sign(payload, process.env.JWT_SECRET_KEY as string, {
    expiresIn: "30m",
  });
};
