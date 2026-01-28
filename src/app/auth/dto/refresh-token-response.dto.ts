import { ApiProperty } from "@nestjs/swagger";

export class RefreshTokenResponseDataDto {
  @ApiProperty({ description: "새 액세스 토큰" })
  token: string;
}

export class RefreshTokenResponseDto {
  @ApiProperty({ description: "응답 메시지" })
  message: string;

  @ApiProperty({
    description: "응답 데이터",
    type: () => RefreshTokenResponseDataDto,
  })
  data: RefreshTokenResponseDataDto;
}
