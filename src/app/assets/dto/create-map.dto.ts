import { IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateMapDto {
  @ApiProperty({ type: String, example: "Sample Map" })
  @IsString()
  name: string;

  @ApiProperty({ type: String, example: "https://example.com/image.jpg" })
  @IsString()
  thumbnail: string;

  @ApiProperty({ type: String, example: "https://example.com/map-source" })
  @IsString()
  mapSrc: string;

  @ApiProperty({ type: String, example: "https://example.com/builder" })
  @IsString()
  builder: string;
}
