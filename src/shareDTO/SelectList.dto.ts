import { ApiProperty } from '@nestjs/swagger';
import { ResponseDto } from 'src/config/response';

export class SelectListList {
  @ApiProperty()
  label?: string;

  @ApiProperty()
  value?: string;

  @ApiProperty()
  type?: string;
}

export class SelectListData {
  @ApiProperty({ type: SelectListList, isArray: true })
  list: Array<SelectListList>;
}

export class SelectListDto extends ResponseDto {
  @ApiProperty({ type: SelectListData })
  declare?: SelectListData;
}
