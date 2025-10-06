import { HttpException, HttpStatus } from '@nestjs/common';
import {
  RECORD_NOT_FOUND_ERROR_MESSAGE,
  USER_NOT_COMLETED_Exception_ERROR_MESSAGE,
} from 'src/config/messages';

export class UserNotCompletedException extends HttpException {
  constructor() {
    super(USER_NOT_COMLETED_Exception_ERROR_MESSAGE, HttpStatus.FORBIDDEN);
  }
}
