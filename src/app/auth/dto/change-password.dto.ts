import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({ type: String, example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ type: String, example: 'newStrongPassword123' })
  @IsString()
  @MinLength(8)
  newPassword: string;
}

