import { HttpException, HttpStatus } from '@nestjs/common';
import { RECORD_NOT_FOUND_ERROR_MESSAGE } from 'src/config/messages';

export class RecordNotFoundException extends HttpException {
  constructor() {
    super(RECORD_NOT_FOUND_ERROR_MESSAGE, HttpStatus.NOT_FOUND);
  }
}
