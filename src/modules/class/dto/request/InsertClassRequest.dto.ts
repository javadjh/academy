import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class InsertClassRequestDto {
  studentIds: any;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  classGroupId: string;

  @ApiProperty()
  @IsString()
  teacherId: string;

  @ApiProperty()
  @IsArray()
  scheduleTimes: any;
}
