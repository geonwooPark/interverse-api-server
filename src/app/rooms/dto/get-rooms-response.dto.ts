import { ApiProperty } from "@nestjs/swagger";
import { RoomLogItemDto } from "./room-log-item.dto";

export class GetRoomsMetadataDto {
  @ApiProperty({ description: "현재 페이지" })
  page: number;

  @ApiProperty({ description: "페이지당 개수" })
  limit: number;

  @ApiProperty({ description: "전체 개수" })
  totalCount: number;

  @ApiProperty({ description: "전체 페이지 수" })
  totalPages: number;
}

export class GetRoomsResponseDataDto {
  @ApiProperty({
    description: "방 로그 목록",
    type: () => RoomLogItemDto,
    isArray: true,
  })
  logs: RoomLogItemDto[];

  @ApiProperty({
    description: "페이지 메타데이터",
    type: () => GetRoomsMetadataDto,
  })
  metadata: GetRoomsMetadataDto;
}

export class GetRoomsResponseDto {
  @ApiProperty({ description: "응답 메시지" })
  message: string;

  @ApiProperty({
    description: "응답 데이터",
    type: () => GetRoomsResponseDataDto,
  })
  data: GetRoomsResponseDataDto;
}
