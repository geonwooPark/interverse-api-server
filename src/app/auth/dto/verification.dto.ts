import { IsEmail, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendVerificationEmailDto {
  @ApiProperty({ type: String, example: 'user@example.com' })
  @IsEmail()
  email: string;
}

export class CheckVerificationCodeDto {
  @ApiProperty({ type: String, example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ type: Number, example: 123456 })
  @IsInt()
  code: number;
}

export class CheckIdDto {
  @ApiProperty({ type: String, example: 'user@example.com' })
  @IsEmail()
  email: string;
}

