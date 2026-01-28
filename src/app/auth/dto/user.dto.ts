import { ApiProperty } from "@nestjs/swagger";

export class UserDto {
  @ApiProperty({ description: "사용자 ID" })
  id: string;

  @ApiProperty({ description: "닉네임" })
  nickname: string;

  @ApiProperty({ description: "이메일" })
  email: string;

  @ApiProperty({ description: "역할", enum: ["admin", "user"] })
  role: "admin" | "user";

  @ApiProperty({ description: "프로필 이미지 URL", required: false })
  profile?: string;
}

export const userDto = (user: any): UserDto => {
  return {
    id: user.id || user._id,
    nickname: user.nickname,
    email: user.email,
    role: user.role,
    profile: user?.profile,
  };
};

