import { ApiProperty } from "@nestjs/swagger";
import { UserDto } from "./user.dto";

export class LoginResponseDataDto {
  @ApiProperty({ description: "액세스 토큰" })
  token: string;

  @ApiProperty({ description: "사용자 정보", type: () => UserDto })
  user: UserDto;
}

export class LoginResponseDto {
  @ApiProperty({ description: "응답 메시지" })
  message: string;

  @ApiProperty({ description: "응답 데이터", type: () => LoginResponseDataDto })
  data: LoginResponseDataDto;
}
