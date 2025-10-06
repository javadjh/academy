import { ApiProperty } from '@nestjs/swagger';

export class ActionDto {
  @ApiProperty()
  state: boolean;
  @ApiProperty()
  message: string;
}
