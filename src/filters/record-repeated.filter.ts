import { HttpException, HttpStatus } from '@nestjs/common';
import { RECORD_IS_DUPLICATE_ERROR_MESSAGE } from 'src/config/messages';

export class RecordRepeatedException extends HttpException {
  constructor() {
    super(RECORD_IS_DUPLICATE_ERROR_MESSAGE, HttpStatus.BAD_REQUEST);
  }
}
