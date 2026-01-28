import { ApiProperty } from "@nestjs/swagger";

export class SuccessResponseDto {
  @ApiProperty({ description: "응답 메시지" })
  message: string;

  @ApiProperty({ description: "성공 여부", example: true })
  data: boolean;
}
