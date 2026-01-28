import { ApiProperty } from "@nestjs/swagger";
import { MapResponseDto } from "../../assets/dto/map-response.dto";

export class RoomResponseDto {
  @ApiProperty({ description: "방 ID" })
  id: string;

  @ApiProperty({ description: "방 제목" })
  title: string;

  @ApiProperty({ description: "호스트 사용자 ID" })
  host: string;

  @ApiProperty({ description: "최대 인원" })
  headCount: number;

  @ApiProperty({ description: "맵 ID" })
  mapId: string;

  @ApiProperty({ description: "생성일시" })
  createdAt: string;

  @ApiProperty({ description: "수정일시" })
  updatedAt: string;

  @ApiProperty({
    description: "맵 정보",
    type: () => MapResponseDto,
    required: false,
  })
  map?: MapResponseDto;

  @ApiProperty({ description: "호스트 여부", required: false })
  isHost?: boolean;
}
