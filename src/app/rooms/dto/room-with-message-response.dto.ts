import { ApiProperty } from "@nestjs/swagger";
import { RoomResponseDto } from "./room-response.dto";

export class RoomWithMessageResponseDto {
  @ApiProperty({ description: "응답 메시지" })
  message: string;

  @ApiProperty({ description: "방 정보", type: () => RoomResponseDto })
  data: RoomResponseDto;
}
