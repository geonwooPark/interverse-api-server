import { IsString, IsNotEmpty, MaxLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ChangeNicknameDto {
  @ApiProperty({ type: String, example: "newNickname", maxLength: 10 })
  @IsNotEmpty({ message: "이름을 입력해주세요." })
  @IsString()
  @MaxLength(10, { message: "이름은 10자 이하로 입력해주세요." })
  nickname: string;
}
