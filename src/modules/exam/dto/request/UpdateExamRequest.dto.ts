import { PartialType } from '@nestjs/swagger';
import { InsertExamRequestDto } from './InsertExamRequest.dto';

export class UpdateExamRequestDto extends PartialType(InsertExamRequestDto) {}
