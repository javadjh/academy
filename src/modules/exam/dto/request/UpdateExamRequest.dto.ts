import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { InsertExamRequestDto } from './InsertExamRequest.dto';

export class UpdateExamRequestDto extends PartialType(InsertExamRequestDto) {}
