import { ApiProperty, PartialType } from '@nestjs/swagger';
import { InsertExamRequestDto } from './InsertExamRequest.dto';
import { IsString } from 'class-validator';

export class InserAdminExamRequestDto extends PartialType(
  InsertExamRequestDto,
) {
  @ApiProperty()
  @IsString()
  teacherId: string;
}
