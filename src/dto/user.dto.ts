import { UserDocument } from "src/models/user.model";

export type UserDto = {
  id: string;
  name: string;
  email: string;
  image: string;
  role: "admin" | "user";
};

export const userDto = (user: UserDocument): UserDto => {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    image: user.image,
    role: user.role,
  };
};
