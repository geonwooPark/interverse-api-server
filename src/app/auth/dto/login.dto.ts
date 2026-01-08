import { IsEmail, IsString, IsNotEmpty, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
  @ApiProperty({ example: "user@example.com" })
  @IsNotEmpty({ message: "이메일을 입력해주세요." })
  @IsEmail({}, { message: "유효한 이메일을 입력해주세요." })
  email: string;

  @ApiProperty({ example: "mypassword123" })
  @IsNotEmpty({ message: "비밀번호를 입력해주세요." })
  @IsString()
  @MinLength(8, { message: "비밀번호는 최소 8자리 이상이어야 합니다." })
  password: string;
}
