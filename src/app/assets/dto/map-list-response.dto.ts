import { ApiProperty } from "@nestjs/swagger";
import { MapResponseDto } from "./map-response.dto";

export class MapListResponseDto {
  @ApiProperty({ description: "응답 메시지" })
  message: string;

  @ApiProperty({
    description: "맵 리스트",
    type: () => MapResponseDto,
    isArray: true,
  })
  data: MapResponseDto[];
}

export class MapWithMessageResponseDto {
  @ApiProperty({ description: "응답 메시지" })
  message: string;

  @ApiProperty({ description: "맵 정보", type: () => MapResponseDto })
  data: MapResponseDto;
}
