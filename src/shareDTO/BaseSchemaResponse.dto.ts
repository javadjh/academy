import { ApiProperty } from '@nestjs/swagger';

export class BaseSchemaResponseDto {
  @ApiProperty()
  createdAt?: string;

  @ApiProperty()
  updatedAt?: string;

  @ApiProperty()
  _id?: string;
}
