import { ApiProperty } from "@nestjs/swagger";

export class CharacterResponseDto {
  @ApiProperty({ description: "캐릭터 ID" })
  id: string;

  @ApiProperty({ description: "캐릭터 이름" })
  name: string;

  @ApiProperty({ description: "소스 URL" })
  source: string;

  @ApiProperty({ description: "너비" })
  width: number;

  @ApiProperty({ description: "높이" })
  height: number;

  @ApiProperty({ description: "생성일시" })
  createdAt: string;

  @ApiProperty({ description: "수정일시" })
  updatedAt: string;
}
