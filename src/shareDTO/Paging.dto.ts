import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class PagingDto {
  @IsOptional()
  @ApiProperty({ required: false })
  pageId?: number = 1;

  @IsOptional()
  @ApiProperty({ required: false })
  eachPerPage: number = 12;

  @IsOptional()
  @ApiProperty({ required: false })
  searchValue?: string = '';
}

export class PagingAdminDto {
  @IsOptional()
  @ApiProperty({ required: false })
  pageId?: number = 1;

  @IsOptional()
  @ApiProperty({ required: false })
  eachPerPage?: number = 12;

  @IsOptional()
  @ApiProperty({ required: false })
  searchValue?: string = '';

  @IsOptional()
  @ApiProperty({ required: false })
  isActive?: Boolean;
}
