import { IsString, IsNumber } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateCharacterDto {
  @ApiProperty({ type: String })
  @IsString()
  name: string;

  @ApiProperty({ type: String })
  @IsString()
  source: string;

  @ApiProperty({ type: Number })
  @IsNumber()
  width: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  height: number;
}
