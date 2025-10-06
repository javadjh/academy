import { HttpException, HttpStatus } from '@nestjs/common';
import { INSERT_ERROR_MESSAGE } from 'src/config/messages';

export class InsertException extends HttpException {
  constructor() {
    super(INSERT_ERROR_MESSAGE, HttpStatus.BAD_REQUEST);
  }
}
