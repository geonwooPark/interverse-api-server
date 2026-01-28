import { ApiProperty } from "@nestjs/swagger";

export class ApiResponseDto<T = any> {
  @ApiProperty({ description: "응답 메시지" })
  message: string;

  @ApiProperty({ description: "응답 데이터", type: () => Object })
  data: T;
}
