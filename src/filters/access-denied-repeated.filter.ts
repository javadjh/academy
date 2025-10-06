import { HttpException, HttpStatus } from '@nestjs/common';
import { ACCESS_ERROR_MESSAGE } from 'src/config/messages';

export class AccessDeniedException extends HttpException {
  constructor() {
    super(ACCESS_ERROR_MESSAGE, HttpStatus.BAD_REQUEST);
  }
}
