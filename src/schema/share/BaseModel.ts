import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class BaseModel {
  createdAt?: string | Date | any;
  updatedAt?: string | Date | any;
  createdAtShamsi?: string | Date | any;
  updatedAtShamsi?: string | Date | any;
}
export class LocationSchema {
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  xValue: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  yValue: number;
}
