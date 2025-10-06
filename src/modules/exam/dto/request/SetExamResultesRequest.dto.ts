import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import { Resultes } from 'src/schema/exam.schema';

export class SetExamResultesRequestDto {
  @ApiProperty()
  @IsArray()
  resultes: Array<Resultes>;
}
