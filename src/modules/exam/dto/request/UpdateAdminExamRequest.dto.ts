import { PartialType } from '@nestjs/swagger';
import { InserAdminExamRequestDto } from './InserAdminExamRequest.dto';

export class UpdateAdminExamRequestDto extends PartialType(
  InserAdminExamRequestDto,
) {}
