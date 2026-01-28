import { ApiProperty } from "@nestjs/swagger";

export class MapResponseDto {
  @ApiProperty({ description: "맵 ID" })
  id: string;

  @ApiProperty({ description: "맵 이름" })
  name: string;

  @ApiProperty({ description: "썸네일 URL" })
  thumbnail: string;

  @ApiProperty({ description: "맵 소스" })
  mapSrc: string;

  @ApiProperty({ description: "빌더" })
  builder: string;

  @ApiProperty({ description: "생성일시" })
  createdAt: string;

  @ApiProperty({ description: "수정일시" })
  updatedAt: string;
}
