import { PartialType } from '@nestjs/swagger';
import { InsertSemesterRequestDto } from './InsertSemesterRequest.dto';

export class UpdateSemesterRequestDto extends PartialType(
  InsertSemesterRequestDto,
) {}
