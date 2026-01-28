import { ApiProperty } from "@nestjs/swagger";
import { RoomResponseDto } from "./room-response.dto";

export class RoomLogItemDto {
  @ApiProperty({ description: "로그 ID" })
  id: string;

  @ApiProperty({ description: "사용자 ID" })
  userId: string;

  @ApiProperty({ description: "방 ID" })
  roomId: string;

  @ApiProperty({ description: "입장일시" })
  joinedAt: string;

  @ApiProperty({ description: "방 정보", type: () => RoomResponseDto })
  room: RoomResponseDto;
}
