import { PartialType } from '@nestjs/swagger';
import { InsertDepartmentRequestDto } from './InsertDepartmentRequest.dto';

export class UpdateDepartmentRequestDto extends PartialType(
  InsertDepartmentRequestDto,
) {}
