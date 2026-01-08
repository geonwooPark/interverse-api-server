import {
  IsEmail,
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  Matches,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
  @ApiProperty({ example: "user@example.com" })
  @IsNotEmpty({ message: "이메일을 입력해주세요." })
  @IsEmail({}, { message: "잘못된 이메일 형식입니다." })
  email: string;

  @ApiProperty({ example: "mypassword123" })
  @IsNotEmpty({ message: "비밀번호를 입력해주세요." })
  @IsString()
  @MinLength(8, { message: "비밀번호는 최소 8자리 이상이어야 합니다." })
  @MaxLength(15, { message: "비밀번호는 최대 15자리까지 가능합니다." })
  @Matches(/^(?=.*[a-zA-Z])(?=.*[0-9]).{8,15}$/, {
    message: "비밀번호는 영문을 포함하여 8~15자리이어야 합니다.",
  })
  password: string;

  @ApiProperty({ example: "geonwoo", maxLength: 10 })
  @IsNotEmpty({ message: "이름을 입력해주세요." })
  @IsString()
  @MaxLength(10, { message: "이름은 10자 이하로 입력해주세요." })
  nickname: string;
}
