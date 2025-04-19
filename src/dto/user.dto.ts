import { UserDocument } from "src/models/user.model";

export type UserDto = {
  id: string;
  nickname: string;
  email: string;
  image: string;
  role: "admin" | "user";
};

export const userDto = (user: UserDocument): UserDto => {
  return {
    id: user._id,
    nickname: user.nickname,
    email: user.email,
    role: user.role,
  };
};
