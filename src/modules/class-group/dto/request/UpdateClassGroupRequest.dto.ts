import { PartialType } from '@nestjs/swagger';
import { InsertClassGroupRequestDto } from './InsertClassGroupRequest.dto';

export class UpdateClassGroupRequestDto extends PartialType(
  InsertClassGroupRequestDto,
) {}
