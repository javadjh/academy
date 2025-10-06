import { BadRequestException } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';
import { OBJECT_ID_ERROR_MESSAGE } from 'src/config/messages';
export class Validator {
  static objectIdValidator(id: string) {
    if (id?.length < 9 || !isValidObjectId(id)) {
      throw new BadRequestException(OBJECT_ID_ERROR_MESSAGE);
    }
  }
}
