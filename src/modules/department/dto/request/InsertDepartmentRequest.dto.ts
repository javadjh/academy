import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class InsertDepartmentRequestDto {
  @ApiProperty()
  @IsString()
  title: string;
}
