import { PartialType } from '@nestjs/swagger';
import { InsertClassRequestDto } from './InsertClassRequest.dto';

export class UpdateClassRequestDto extends PartialType(InsertClassRequestDto) {}
