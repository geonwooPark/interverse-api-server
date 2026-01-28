// dto/get-rooms.query.dto.ts
import { Type } from "class-transformer";
import { IsInt, Min, Max, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class GetRoomsQueryDto {
  @ApiProperty({ type: Number, required: false, example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;

  @ApiProperty({ type: Number, required: false, example: 6 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit = 6;
}
