import { ApiProperty, PartialType } from '@nestjs/swagger';
import { InsertAdminUserRequestDto } from './InsertAdminUserRequest.dto';
import { IsEnum, IsString } from 'class-validator';
import { userTypeEnum } from 'src/shareDTO/enums';

export class UpdateAdminUserRequestDto {
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
  @IsEnum(userTypeEnum)
  userType: string;
}
