import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMapDto {
  @ApiProperty({ example: 'Sample Map' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'https://example.com/image.jpg' })
  @IsString()
  thumbnail: string;

  @ApiProperty({ example: 'https://example.com/map-source' })
  @IsString()
  mapSrc: string;

  @ApiProperty({ example: 'https://example.com/builder' })
  @IsString()
  builder: string;
}

