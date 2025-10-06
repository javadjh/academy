import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class LoginRequestDto {
  @ApiProperty()
  @IsString()
  @Length(11, 11)
  phoneNumber: string;

  @ApiProperty()
  @IsString()
  password: string;
}
