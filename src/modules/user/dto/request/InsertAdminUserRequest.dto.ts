import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { genderEnum, userTypeEnum } from 'src/shareDTO/enums';

export class InsertAdminUserRequestDto {
  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsString()
  phoneNumber: string;

  @ApiProperty()
  @IsString()
  password: string;

  @ApiProperty()
  @IsString()
  @IsEnum(genderEnum)
  gender: string;

  @ApiProperty()
  @IsString()
  @IsEnum(userTypeEnum)
  userType: string;
}
