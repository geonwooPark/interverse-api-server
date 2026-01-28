import { ApiProperty } from "@nestjs/swagger";
import { CharacterResponseDto } from "./character-response.dto";

export class CharacterListResponseDto {
  @ApiProperty({ description: "응답 메시지" })
  message: string;

  @ApiProperty({
    description: "캐릭터 리스트",
    type: () => CharacterResponseDto,
    isArray: true,
  })
  data: CharacterResponseDto[];
}

export class CharacterWithMessageResponseDto {
  @ApiProperty({ description: "응답 메시지" })
  message: string;

  @ApiProperty({ description: "캐릭터 정보", type: () => CharacterResponseDto })
  data: CharacterResponseDto;
}
