// dto/get-rooms.query.dto.ts
import { Type } from "class-transformer";
import { IsInt, Min, Max, IsOptional } from "class-validator";

export class GetRoomsQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit = 6;
}
