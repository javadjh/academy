import { HttpException, HttpStatus } from '@nestjs/common';
import { OBJECT_ID_ERROR_MESSAGE } from 'src/config/messages';

export class ObjectIdNotValidException extends HttpException {
  constructor() {
    super(OBJECT_ID_ERROR_MESSAGE, HttpStatus.BAD_REQUEST);
  }
}
