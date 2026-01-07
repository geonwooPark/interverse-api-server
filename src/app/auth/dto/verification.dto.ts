import { IsEmail, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendVerificationEmailDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;
}

export class CheckVerificationCodeDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 123456 })
  @IsInt()
  code: number;
}

export class CheckIdDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;
}

