import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class InsertExamRequestDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  date: string;

  @ApiProperty()
  @IsString()
  time: string;

  @ApiProperty()
  @IsString()
  studentIds: string;

  @ApiProperty()
  @IsString()
  classId: string;
}
