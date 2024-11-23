import { UserDocument } from "src/models/user.model";

export type UserDto = {
  id: string;
  nickname: string;
  email: string;
  image: string;
  role: "admin" | "user";
  relations: {
    follower: string[];
    following: string[];
  };
};

export const userDto = (user: UserDocument): UserDto => {
  return {
    id: user._id,
    nickname: user.nickname,
    email: user.email,
    image: user.image,
    role: user.role,
    relations: user.relations,
  };
};
