import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class InsertClassRequestDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  teacherId: string;

  @ApiProperty()
  @IsArray()
  studentIds: string;

  @ApiProperty()
  @IsArray()
  scheduleTimes: string;
}
