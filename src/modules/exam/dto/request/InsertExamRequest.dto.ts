import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class InsertExamRequestDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  date: string;

  @ApiProperty()
  @IsString()
  classGroupId: string;

  @ApiProperty()
  @IsString()
  time: string;

  studentIds: Array<string>;

  @ApiProperty()
  @IsString()
  classId: string;
}
