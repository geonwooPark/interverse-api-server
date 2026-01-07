import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CheckPasswordDto {
  @ApiProperty({ example: '123456' })
  @IsString()
  password: string;
}

