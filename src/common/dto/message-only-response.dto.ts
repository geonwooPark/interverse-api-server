import { ApiProperty } from "@nestjs/swagger";

export class MessageOnlyResponseDto {
  @ApiProperty({ description: "응답 메시지" })
  message: string;

  @ApiProperty({
    description: "응답 데이터 (없음)",
    nullable: true,
    type: () => Object,
  })
  data: null;
}
