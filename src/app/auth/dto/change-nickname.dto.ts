import { IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangeNicknameDto {
  @ApiProperty({ example: 'newNickname', maxLength: 10 })
  @IsString()
  @MaxLength(10, { message: '이름은 10자 이하로 입력해주세요.' })
  nickname: string;
}

