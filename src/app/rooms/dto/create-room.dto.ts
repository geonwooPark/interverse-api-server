import { IsString, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoomDto {
  @ApiProperty({ example: '새로운 방' })
  @IsString()
  title: string;

  @ApiProperty({ example: '1234' })
  @IsString()
  password: string;

  @ApiProperty({ example: 6 })
  @IsNumber()
  @Min(2)
  @Max(20)
  headCount: number;

  @ApiProperty({ example: 'office', description: '맵의 mapSrc로 맵을 찾아서 연결합니다' })
  @IsString()
  mapSrc: string;
}

