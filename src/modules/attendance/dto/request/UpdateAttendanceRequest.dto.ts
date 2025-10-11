import { PartialType } from '@nestjs/swagger';
import { InsertAttendanceRequestDto } from './InsertAttendanceRequest.dto';

export class UpdateAttendanceRequestDto extends PartialType(
  InsertAttendanceRequestDto,
) {}
