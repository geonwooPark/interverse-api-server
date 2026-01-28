import { ApiProperty } from "@nestjs/swagger";
import { UserDto } from "./user.dto";

export class UserResponseDto {
  @ApiProperty({ description: "응답 메시지" })
  message: string;

  @ApiProperty({ description: "사용자 정보", type: () => UserDto })
  data: UserDto;
}
